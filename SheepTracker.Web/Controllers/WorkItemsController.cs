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
            //Thread.Sleep(3000);
            return new[] {new {a = "bbb", b = "ccc"}, new {a = "xxx", b = "yyy"}};
        }

    }
}
