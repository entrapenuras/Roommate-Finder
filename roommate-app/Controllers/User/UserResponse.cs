﻿using Microsoft.AspNetCore.Mvc;
using roommate_app.Models;

namespace roommate_app.Controllers;
public class UserResponse
{
    public UserResponse(User user)
    {
        Id = user.Id;
        FirstName = user.FirstName;
        LastName = user.LastName;
        Email = user.Email;
        City = user.City;
    }

    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string City { get; set; }
}
