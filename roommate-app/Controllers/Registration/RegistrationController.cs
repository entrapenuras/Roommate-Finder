﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using roommate_app.Models;
using roommate_app.Data;
using roommate_app.Services;

namespace roommate_app.Controllers.Registration;

[Route("[controller]")]
[ApiController]
public class RegistrationController : ControllerBase
{
    private readonly IGenericService _genericService;
    public RegistrationController(IGenericService genericService)
    {
        _genericService = genericService;
    }

    [HttpPost]
    public async Task<OkObjectResult> Submit([FromBody] User user)
    {
        var emailExistsFlag = false;

        List<User> existingUsers = await _genericService.GetAllAsync<User>();

        emailExistsFlag = (
                from User usr in existingUsers
                where usr.Email.Trim().ToLower() == user.Email.Trim().ToLower()
                select usr
            ).Count() > 0;

        if (!emailExistsFlag)
        {
            await _genericService.AddAsync<User>(user);
        }

        return base.Ok(
            new RegistrationResponse(
                !emailExistsFlag,
                emailExistsFlag 
                    ? "Account with this email already exists"
                    : "Your account has been successfully created."
            )
        );
    }
}

