﻿using System.ComponentModel;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using roommate_app.Data;
using roommate_app.Services;

namespace roommate_app.Models;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string City { get; set; }
    //public List<Listing> Listings { get; set; }

}

