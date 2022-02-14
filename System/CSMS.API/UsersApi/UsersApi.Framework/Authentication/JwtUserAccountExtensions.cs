using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UsersApi.Constants.System;
using UsersApi.Framework.Configuration.Options;

namespace UsersApi.Framework.Authentication
{
    public static class JwtUserAccountExtensions
    {
        private static long ToUnixEpochDate(DateTime date) => (long)Math.Round((date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);

        public static string GenerateToken(this JwtUserAccount account, JwtOptions jwtOptions)
        {
            try
            {
                jwtOptions.IssuedAt = DateTime.UtcNow;
                List<Claim> claims = new List<Claim>()
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Sub, account.UserId.ToString()),
                    new Claim("Authenticated", "True"),
                    new Claim("user_name", account.UserName ?? SystemConstant.EMPTY_USER_NAME),
                    new Claim("user_id", account.UserId.ToString()),
                    new Claim("user_email", account.Email ?? SystemConstant.EMPTY_USER_EMAIL),
                    new Claim("user_phone_number", account.PhoneNumber ?? SystemConstant.EMPTY_USER_PHONE_NUMBER),
                    new Claim("last_name", account.LastName),
                    new Claim("middle_name", account.MiddleName ?? SystemConstant.EMPTY_USER_MIDDLE_NAME),
                    new Claim("first_name", account.FirstName),
                    new Claim("user_code", account.UserCode ?? SystemConstant.EMPTY_USER_CODE)
                };

                // Create the JWT and write it to a string
                JwtSecurityToken jwtToken = new JwtSecurityToken(
                    issuer: jwtOptions.Issuer,
                    audience: jwtOptions.Audience,
                    claims: claims,
                    notBefore: jwtOptions.NotBefore,
                    expires: jwtOptions.Expiration,
                    signingCredentials: jwtOptions.SigningCredentials);

                return new JwtSecurityTokenHandler().WriteToken(jwtToken);
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
    }
}
