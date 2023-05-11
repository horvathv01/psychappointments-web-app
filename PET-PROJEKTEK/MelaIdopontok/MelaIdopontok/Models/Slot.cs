using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Models;

public class Slot
{
    public DateTime Start { get; }
    public DateTime End { get; }
    public bool Taken { get; private set; }
    public bool Pending { get; private set; }
    public Session? Session { get; set; }

    public static int ID = 0;
    
    public int RoomPrice { get; private set; }

    public Slot(DateTime start, int length, int roomPrice, bool taken = false, bool pending = false, Session? session = null)
    {
        this.Start = start;
        End = start.AddMinutes(length);
        this.Taken = taken;
        this.Pending = pending;
        this.Session = session;
        this.RoomPrice = roomPrice;
        ID++;
    }

    public void SetPending(bool input)
    {
        Pending = input;
        if (Pending)
        {
            Console.WriteLine($"Slot number {ID}'s status is pending");
        }
        else
        {
            Console.WriteLine($"Slot number {ID}'s status is not pending");
        }
    }

    public void SetTaken(bool input)
    {
        Taken = input;
        if (Pending)
        {
            Console.WriteLine($"Slot number {ID}'s status is TAKEN, pending: {Pending}");
        }
        else
        {
            Console.WriteLine($"Slot number {ID}'s status is NOT TAKEN, pending: {Pending}");
        }
    }

    public void SetRoomPrice(int price)
    {
        RoomPrice = price;
    }


    public override bool Equals(object? obj)
    {
        return obj is Slot x
               && x.Start == Start
               && x.End == End
               && x.RoomPrice == RoomPrice;
    }
    
}