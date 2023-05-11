namespace ScoutCamp.Models;


public class Patrol
{
    public Enums.Genders Gender { get; private set; }
    public List<ICamper> Campers { get; private set; }
    public int Rope { get; private set; }
    private int findWoodChance;
    private int buildChance;

    public 
    //10 people: only boys or only girls (thus: has gender)
    //has 400 m of rope for the whole of 10 days
}