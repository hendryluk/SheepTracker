using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Http;
using System.Web.Mvc;

namespace SheepTracker.Web.Controllers
{
    public class WorkItemsController : ApiController
    {
        public IEnumerable Get(string q, int pageSize, int pageIndex)
        {
            Thread.Sleep(3000);
            //return new[] {new
            //                  {
            //                      Title = "bbb", Actions= []
            //                  }, new {Title = "xxx", Actions = "yyy"}};

            return new[]
                       {
                           new { Title = "aaa bbb ccc", Actions = new []
                                {
                                    new {Type = "Details", Uri = "/WorkItems/Blah"},
                                    new {Type = "Start", Uri = "/WorkItems/Blah"}
                                }},
                            new { Title = "vvv xxx yyy", Actions = new []
                                {
                                    new {Type = "Details", Uri = "/WorkItems/Blah"},
                                    new {Type = "CreateTask", Uri = "/WorkItems/Blah"}
                                }}
                       };
        }

    }
}
