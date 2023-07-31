using MelaIdopontok.Models;
using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Enums;
using MelaIdopontok.Program.Service;

namespace MelaIdopontok.Program.Models;

public abstract class Person
{
    public String Name { get; }
    public PersonType Type { get; set; }

    public Person(string name)
    {
        Name = name;
    }

    public override bool Equals(object? obj)
    {
        return obj is Person p
               && p.Name == Name;
    }
    
}