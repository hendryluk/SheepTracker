using System;

namespace TimeTracking.Commands
{
    public class StartWork
    {
        public DateTime Started { get; set; }
        public Guid WorkItemId { get; set; }
    }
}