namespace MelaIdopontok.Program.Models;

public class Person
{
    public String name { get; }

    public Person(string name)
    {
        this.name = name;
    }

    public override bool Equals(object? obj)
    {
        return obj is Person p
               && p.name == name;
    }
}