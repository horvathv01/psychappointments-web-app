using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Models;

public class Slot
{
    public int Id;
    public Psychologist Psychologist;
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public List<Session> Sessions { get; set; }
    public double RoomPrice { get; set; }

    public Slot(int id, Psychologist psychologist, DateTime start, int length, double roomPrice, List<Session>? sessions = null)
    {
        Id = id;
        Psychologist = psychologist;
        Start = start;
        End = start.AddMinutes(length);
        Sessions = sessions ?? new List<Session>();
        RoomPrice = roomPrice;
    }

    public override bool Equals(object? obj)
    {
        return obj is Slot x
               && x.Start == Start
               && x.End == End
               && x.RoomPrice == RoomPrice;
    }
    
}