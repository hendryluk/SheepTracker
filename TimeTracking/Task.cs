using System;
using System.Collections.Generic;
using Cqrs.EventSourcing;

namespace TimeTracking
{
    public class Task: EventSourced
    {
        public Task(string name, string description, string projectId): base(Guid.NewGuid())
        {
            Update(new Created { Name  = name, Description = description, ProjectId = projectId});
        }

        public Task(Guid id, IEnumerable<IVersionedEvent> history)
            : base(id)
        {
            LoadFrom(history);
        }

        public class Created: VersionedEvent
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string ProjectId { get; set; }
        }
    }
}