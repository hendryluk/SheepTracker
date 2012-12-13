using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using Cqrs.Utils;

namespace Cqrs.EventSourcing
{
    class CachedEventSourcedRepository<T>: IEventSourcedRepository<T> where T : class, IEventSourced
    {
        private readonly IEventStore _eventStore;
        private readonly IEventStoreBusPublisher _publisher;
        private readonly Func<Guid, IEnumerable<IVersionedEvent>, T> _entityFactory;
        private readonly Func<Guid, IMemento, IEnumerable<IVersionedEvent>, T> _originatorEntityFactory;
        private readonly ObjectCache _cache;
        private readonly Action<T> _cacheMementoIfApplicable;
        private readonly Func<Guid, Tuple<IMemento, DateTime?>> _getMementoFromCache;
        private readonly Action<Guid> _markCacheAsStale;


        public CachedEventSourcedRepository(IEventStore eventStore, IEventStoreBusPublisher publisher, ObjectCache cache)
        {
            _eventStore = eventStore;
            _publisher = publisher;
            _cache = cache;

            // TODO: could be replaced with a compiled lambda to make it more performant
            var constructor = typeof(T).GetConstructor(new[] { typeof(Guid), typeof(IEnumerable<IVersionedEvent>) });
            if (constructor == null)
            {
                throw new InvalidCastException(
                    "Type T must have a constructor with the following signature: .ctor(Guid, IEnumerable<IVersionedEvent>)");
            }
            _entityFactory = (id, events) => (T)constructor.Invoke(new object[] { id, events });

            if (typeof(IMementoOriginator).IsAssignableFrom(typeof(T)) && this._cache != null)
            {
                // TODO: could be replaced with a compiled lambda to make it more performant
                var mementoConstructor = typeof(T).GetConstructor(new[] { typeof(Guid), typeof(IMemento), typeof(IEnumerable<IVersionedEvent>) });
                if (mementoConstructor == null)
                {
                    throw new InvalidCastException(
                        "Type T must have a constructor with the following signature: .ctor(Guid, IMemento, IEnumerable<IVersionedEvent>)");
                }
                _originatorEntityFactory = (id, memento, events) => (T)mementoConstructor.Invoke(new object[] { id, memento, events });
                _cacheMementoIfApplicable = (T originator) =>
                {
                    string key = GetPartitionKey(originator.Id);
                    var memento = ((IMementoOriginator)originator).SaveToMemento();
                    _cache.Set(
                        key,
                        new Tuple<IMemento, DateTime?>(memento, DateTime.UtcNow),
                        new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.UtcNow.AddMinutes(30) });
                };
                _getMementoFromCache = id => (Tuple<IMemento, DateTime?>)this._cache.Get(GetPartitionKey(id));
                _markCacheAsStale = id =>
                {
                    var key = GetPartitionKey(id);
                    var item = (Tuple<IMemento, DateTime?>)this._cache.Get(key);
                    if (item != null && item.Item2.HasValue)
                    {
                        item = new Tuple<IMemento, DateTime?>(item.Item1, null);
                        _cache.Set(
                            key,
                            item,
                            new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.UtcNow.AddMinutes(30) });
                    }
                };
            }
            else
            {
                // if no cache object or is not a cache originator, then no-op
                _cacheMementoIfApplicable = o => { };
                _getMementoFromCache = id => null;
                _markCacheAsStale = id => { };
            }
        }

        public T Find(Guid id)
        {
            var cachedMemento = _getMementoFromCache(id);
            if (cachedMemento != null && cachedMemento.Item1 != null)
            {
                // NOTE: if we had a guarantee that this is running in a single process, there is
                // no need to check if there are new events after the cached version.
                IEnumerable<IVersionedEvent> deserialized;
                if (!cachedMemento.Item2.HasValue || cachedMemento.Item2.Value < DateTime.UtcNow.AddSeconds(-1))
                {
                    
                    deserialized = _eventStore.Load(GetPartitionKey(id), cachedMemento.Item1.Version + 1);
                }
                else
                {
                    // if the cache entry was updated in the last seconds, then there is a high possibility that it is not stale
                    // (because we typically have a single writer for high contention aggregates). This is why we optimistically avoid
                    // getting the new events from the EventStore since the last memento was created. In the low probable case
                    // where we get an exception on save, then we mark the cache item as stale so when the command gets
                    // reprocessed, this time we get the new events from the EventStore.
                    deserialized = Enumerable.Empty<IVersionedEvent>();
                }

                return _originatorEntityFactory.Invoke(id, cachedMemento.Item1, deserialized);
            }
            else
            {
                var deserialized = _eventStore.Load(GetPartitionKey(id), 0)
                    .AsCachedAnyEnumerable();

                if (deserialized.Any())
                {
                    return _entityFactory.Invoke(id, deserialized);
                }
            }

            return null;
        }


        public T Get(Guid id)
        {
            var entity = this.Find(id);
            if (entity == null)
            {
                throw new EntityNotFoundException(id, typeof(T));
            }

            return entity;
        }

        public void Save(T eventSourced, string correlationId)
        {
            // TODO: guarantee that only incremental versions of the event are stored
            var events = eventSourced.Events.ToArray();
            
            var partitionKey = GetPartitionKey(eventSourced.Id);
            try
            {
                _eventStore.Save(partitionKey, events);
            }
            catch
            {
                _markCacheAsStale(eventSourced.Id);
                throw;
            }

            this._publisher.SendAsync(partitionKey, events.Length);

            this._cacheMementoIfApplicable.Invoke(eventSourced);
        }

        private string GetPartitionKey(Guid id)
        {
            return typeof(T).Name + "_" + id.ToString();
        }

        
    }
}
