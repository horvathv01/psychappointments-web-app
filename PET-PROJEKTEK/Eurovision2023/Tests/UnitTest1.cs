using MyNamespace.Enums;
using MyNamespace.Model;

namespace Tests;

public class Tests
{
    

    [Test]
    public void Test1()
    {
        CountryPoints Austria = new CountryPoints(Countries.Austria, 5);
        Austria.Points[0] = 5;
        Austria.Points[1] = 6;
        Austria.Points[2] = 7;
        Austria.Points[3] = 8;
        Austria.Points[4] = 9;

        double assert = 7;
        double result = Austria.CalculateAverage();
        Console.WriteLine($"result is: {result}");
        Assert.That(result, Is.EqualTo(assert));
    }
}