using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Models;

public abstract class Worker : Person
{
    public List<Location> Locations;
    public Worker(string name, List<Location>? locations = null) : base(name)
    {
        Locations = locations ?? new List<Location>();
    }
    
}