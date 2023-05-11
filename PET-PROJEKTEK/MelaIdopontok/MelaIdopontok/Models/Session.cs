namespace MelaIdopontok.Program.Models;

public class Session
{
    public Person Person { get; }
    public int Price { get; }
 

    public Session(Person person, int price)
    {
        Person = person;
        Price = price;
    }

    public override bool Equals(object? obj)
    {
        return obj is Session ses
               && ses.Person.Equals(Person)
               && ses.Price == Price;
    }
}