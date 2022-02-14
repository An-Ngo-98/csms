using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace GatewayAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((host, config) =>
            {
                string ocelotFileName = host.HostingEnvironment.EnvironmentName == "Development" ? "ocelot.development.json" : "ocelot.json";
                config.AddJsonFile(ocelotFileName);
            })
            .UseIISIntegration()
            .UseStartup<Startup>();
    }
}
