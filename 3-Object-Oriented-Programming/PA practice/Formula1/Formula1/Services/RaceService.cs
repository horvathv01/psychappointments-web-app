using Formula1.Models;

namespace Formula1.Services;

public class RaceService
{
    public Driver Driver { get; set; }
    public PitCrewMember[] CrewMembers { get; } = new PitCrewMember[4];
    public Engineer[] Engineers { get; } = new Engineer[2];
    public Car Car { get; set; }

    public Race(Driver driver, Car car, PitCrewMember[] crewMembers, Engineer[] engineers)
    {
        Driver = driver;
        Car = car;
        CrewMembers = crewMembers;
        Engineers = engineers;
    }

    public int RunRace()
    {
        int cost = 0;
        if (Car.IsReadyForRace())
        {
            cost += Car.Race();    
        }
        else
        {
            throw new Exception("Car is out of parts, thus cannot race!");
        }
        
        cost += Driver.Payment;
        
        foreach (var pitCrewMember in CrewMembers)
        {
            cost += pitCrewMember.Payment;
        }
        foreach (var engineer in Engineers)
        {
            cost += engineer.Payment;
        }
        
        return cost;
    }
}