namespace Cqrs.EventSourcing
{
    using System.Collections.Generic;

    public interface IEventStore
    {
        IEnumerable<IVersionedEvent> Load(string partitionKey, int version);

        void Save(string partitionKey, IEnumerable<IVersionedEvent> events);
    }   
}