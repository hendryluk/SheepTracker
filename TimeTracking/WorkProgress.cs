using System;
using Cqrs.EventSourcing;
using Cqrs.Messaging;

namespace TimeTracking
{
    public class WorkProgress: EventSourced
    {
        private Guid _workId;
        private DateTime _startedTime;
        private TimeSpan? _adjustment;

        public WorkProgress(Guid id, Guid workId, DateTime startedTime) : this(id)
        {
            Update(new Started
                       {
                           WorkId = workId,
                           SourceId = id,
                           StartedTime = startedTime
                       });
        }

        private WorkProgress(Guid id) : base(id)
        {
            Handles<Started>(OnStarted);
            Handles<Stopped>(OnStopped);
            Handles<ChangedDurationSoFar>(OnChangedDurationSoFar);
        }

        private void OnChangedDurationSoFar(ChangedDurationSoFar ev)
        {
            
        }

        private void OnStopped(Stopped ev)
        {
        }

        private void OnStarted(Started ev)
        {
            _startedTime = ev.StartedTime;
        }

        public void ChangeStartTime(DateTime startTime)
        {
            
        }

        public void ChangeDurationSoFar(DateTime now, TimeSpan duration)
        {
            
        }

        public class Started: VersionedEvent
        {
            public DateTime StartedTime { get; set; }
            public Guid WorkId { get; set; }
        }

        public class Stopped: VersionedEvent
        {
            public DateTime StoppedTime { get; set; }
            public TimeSpan? OverrideDuration { get; set; }
        }

        public class ChangedDurationSoFar: VersionedEvent
        {
            public DateTime ChangedAt { get; set; }
            public TimeSpan Duration { get; set; }
        }
    }
}