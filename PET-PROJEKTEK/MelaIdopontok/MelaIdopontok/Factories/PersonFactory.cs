using MelaIdopontok.Models;
using MelaIdopontok.Program.Enums;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.Service;

public class PersonFactory
{
    public Person CreatePerson(PersonType type, string name, List<Location>? locations = null, List<Slot>? slots = null, List<Session>? sessions = null)
    {
        switch (type)
        {
            case PersonType.Client:
                return new Client(name, sessions);
            case PersonType.Manager:
                return new Manager(name);
            case PersonType.Psychologist:
                return new Psychologist(name, locations, slots, sessions);
            default: return null;
        }
    }
}