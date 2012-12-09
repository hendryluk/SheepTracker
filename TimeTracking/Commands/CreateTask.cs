using System;
using Cqrs.EventSourcing;

namespace TimeTracking.Commands
{
    public class CreateTask
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public string ProjectId { get; set; }
    }
}