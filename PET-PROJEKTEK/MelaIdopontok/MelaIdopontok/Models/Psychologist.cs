using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Enums;
using MelaIdopontok.Program.Models;
using MelaIdopontok.Program.Service;

namespace MelaIdopontok.Models;

public class Psychologist : Worker
{
    public List<Slot> Slots;
    public List<Session> Sessions;
    private IPsychologistManager _psychologistManager;

    public Psychologist(string name, List<Location>? locations = null, List<Slot>? slots = null, List<Session>? sessions = null) : base(name, locations)
    {
        Type = PersonType.Psychologist;
        Slots = slots ?? new List<Slot>();
        Sessions = sessions ?? new List<Session>();
    }
  
    
}
