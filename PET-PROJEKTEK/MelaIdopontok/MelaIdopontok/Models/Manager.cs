using MelaIdopontok.Program.Enums;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Models;

public class Manager : Worker
{
    public Manager(string name) : base(name)
    {
        Type = PersonType.Manager;
    }
    
}