using Cqrs.EventSourcing;

namespace TimeTracking
{
    public class Task
    {
        public class Created: VersionedEvent
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string ProjectId { get; set; }
        }
    }
}