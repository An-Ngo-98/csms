using System.Security.Claims;

namespace WarehouseApi.Common.Securities
{
    public static class ClaimsPrincipalExtensions
    {
        public static string UserId(this ClaimsPrincipal principal) => principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        public static string UserName(this ClaimsPrincipal principal) => principal.FindFirst(ClaimTypes.Name)?.Value;
        public static string FullName(this ClaimsPrincipal principal) => principal.FindFirst("FullName")?.Value;
        public static string ShortName(this ClaimsPrincipal principal) => principal.FindFirst("ShortName")?.Value;
    }
}
