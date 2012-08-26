using System;
using Cqrs.EventSourcing;
using Cqrs.Messaging;

namespace TimeTracking
{
    public class WorkEntry
    {
        private DateTime? _startedTime;
        private TimeSpan _timeSpan;

        public class Create: ICommand
        {
            public Guid Id { get; private set; }
        }

        public class Created: VersionedEvent
        {
             
        }
    }
}