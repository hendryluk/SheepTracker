﻿using System.Web;
using System.Web.Optimization;
using SheepTracker.Web.Bundling;

namespace SheepTracker.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-1.*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/app")
                .IncludeDirectory("~/Scripts/app", "*.js", true));

            //bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            //bundles.Add(new StyleBundle("~/Content/themes/app/css").Include(
            //    "~/Scripts/dijit/dijit.css",
            //    "~/Scripts/dijit/themes/claro/claro.css",
            //    "~/Content/themes/app/*.min.css"));

            bundles.Add(new Bundle("~/Content/themes/app/css")
                            {
                                Transforms = {new DotlessTransform()}
                            }
                            .Include("~/Content/themes/app/*.less"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        //"~/Content/themes/base/jquery.ui.core.css",
                        //"~/Content/themes/base/jquery.ui.resizable.css",
                        //"~/Content/themes/base/jquery.ui.selectable.css",
                        //"~/Content/themes/base/jquery.ui.accordion.css",
                        //"~/Content/themes/base/jquery.ui.autocomplete.css",
                        //"~/Content/themes/base/jquery.ui.button.css",
                        //"~/Content/themes/base/jquery.ui.dialog.css",
                        //"~/Content/themes/base/jquery.ui.slider.css",
                        //"~/Content/themes/base/jquery.ui.tabs.css",
                        //"~/Content/themes/base/jquery.ui.datepicker.css",
                        //"~/Content/themes/base/jquery.ui.progressbar.css",
                        //"~/Content/themes/base/jquery.ui.theme.css",
                        
                        "~/Scripts/dijit/themes/claro/claro.css"
                        ));
        }
    }
}