using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Http;
using System.Web.Mvc;
using Cqrs.EventSourcing;
using TimeTracking;

namespace SheepTracker.Web.Controllers
{
    public class WorkItemsController : ApiController
    {
        private readonly IEventSourcedRepository<Task> _workItemRepository;

        //public WorkItemsController(IEventSourcedRepository<Task> workItemRepository)
        //{
        //    _workItemRepository = workItemRepository;
        //}

        private static readonly IList<string> WorkItems = new List<string>();

        public IEnumerable Get(string q, int pageSize, int pageIndex)
        {
            Thread.Sleep(500);
            //return new[] {new
            //                  {
            //                      Title = "bbb", Actions= []
            //                  }, new {Title = "xxx", Actions = "yyy"}};

            //return new[]
            //           {
            //               new { Title = "aaa bbb ccc", Actions = new []
            //                    {
            //                        new {Type = "Details", Uri = "/WorkItems/Blah"},
            //                        new {Type = "Start", Uri = "/WorkItems/Blah"}
            //                    }},
            //                new { Title = "vvv xxx yyy", Actions = new []
            //                    {
            //                        new {Type = "Details", Uri = "/WorkItems/Blah"},
            //                        new {Type = "CreateTask", Uri = "/WorkItems/Blah"}
            //                    }}
            //           };



            return (q==null? 
                WorkItems
                : WorkItems.Where(x=> q.Split(' ').Where(y=> y.Length > 0).All(y=> x.ToLowerInvariant().Contains(y.ToLowerInvariant())))
                ).Select(x => new
                                              {
                                                  Title = x,
                                                  Actions = new[]
                                                                {
                                                                    new {Type = "Details", Uri = "/WorkItems/Details"},
                                                                    new {Type = "Start", Uri = "/WorkItems/Start"}
                                                                }
                                              });
        }

        public void PostCreateTaskCommand(string name)
        {
            WorkItems.Add(name);
            //_workItemRepository.Save(new Task(name, name, ""), Guid.NewGuid().ToString());
        }

        

    }
}
