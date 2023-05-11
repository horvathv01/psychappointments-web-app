using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program;

public class Program
{
    public static void Main()
    {
        Place place = new Place("Wekerle");
        Slot slot1 = new Slot(new DateTime(2023, 03, 14, 16, 0, 0), 50, roomPrice:3500);
        Slot slot2 = new Slot(new DateTime(2023, 03, 14, 17, 0, 0), 50, roomPrice:3500);
        Slot slot3 = new Slot(new DateTime(2023, 03, 14, 17, 10, 0), 50, roomPrice:3500);

        Person person1 = new Person("Béla");
        Session session1 = new Session(person1, 12000);
        
        place.AddSlot(slot1);
        place.AddSlot(slot2);
        place.AddSession(slot1, session1);
        
        place.AboutPlace();

    }
}