using Cqrs.Messaging.Handling;
using Raven.Client;
using TimeTracking.Commands;

namespace TimeTracking.ViewModel.VmGenerators
{
    public class WorkItemVmGenerator: IEventHandler<Task.Created>
    {
        private readonly IDocumentStore _store;

        public WorkItemVmGenerator(IDocumentStore store)
        {
            _store = store;
        }
        public void Handle(Task.Created ev)
        {
            using (var session = _store.OpenSession())
            {
                session.Store(new WorkItemVm{WorkItemId = ev.SourceId, Name = ev.Name, Description = ev.Description});
            }
        }
    }
}