using System;
using System.Collections.Generic;
using Cqrs.EventSourcing;
using Raven.Client;
using Raven.Imports.Newtonsoft.Json.Linq;
using Raven.Client.Linq;
using System.Linq;

namespace Cqrs.RavenDbStore
{
    public class RavenDbEventStore: IEventStore
    {
        private readonly IDocumentStore _store;

        public RavenDbEventStore(IDocumentStore store)
        {
            _store = store;
        }

        public IEnumerable<IVersionedEvent> Load(string partitionKey, int minVersion)
        {
            using (var session = _store.OpenSession())
            {
                return session.Query<EventData>()
                       .Where(x => x.PartitionKey == partitionKey && x.Version >= minVersion)
                       .ToArray()
                       .Select(x => ToObject(x.Event, x.Type))
                       .OfType<IVersionedEvent>();
            }
        }

        public object ToObject(JObject obj, Type type)
        {
            return typeof (JObject).GetMethod("ToObject").MakeGenericMethod(new[] {type}).Invoke(obj, new object[0]);
        }

        public void Save(string partitionKey, IEnumerable<IVersionedEvent> events)
        {
            using (var session = _store.OpenSession())
            {
                foreach(var ev in events)
                    session.Store(new EventData
                                      {
                                          PartitionKey = partitionKey, 
                                          Version = ev.Version, 
                                          Type = ev.GetType(),
                                          Event = JObject.FromObject(ev)
                                      });
            }
        }

        private class EventData
        {
            public string PartitionKey { get; set; }
            public int Version { get; set; }
            public Type Type { get; set; }
            public JObject Event { get; set; }
        }
    }
}