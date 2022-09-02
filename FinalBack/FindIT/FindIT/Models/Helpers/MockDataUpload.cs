using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FindIT.Models
{
    public class MockDataUpload
    {
        public static List<dynamic> LoadJson()
        {
            using (StreamReader r = new StreamReader("../../Contracts_MOCK_DATA.json"))
            {
                string json = r.ReadToEnd();
                List<dynamic> result = JsonConvert.DeserializeObject<List<dynamic>>(json);
                return result;
            }
        }

        public static void JsonToConsultants()
        {
            var result = LoadJson();
            using (FindIT_DbContext newConnection = new FindIT_DbContext())
            {
                foreach (var item in result)
                {
                    Consultant newConsult = new Consultant();
                    newConsult.Name = item.name;
                    newConsult.Available = item.available;
                    newConsult.Details = item.details;
                    newConsult.Experience = item.experience;
                    newConsult.Salary = item.salary;
                    newConnection.Consultants.Add(newConsult);
                }
                newConnection.SaveChanges();
            }
        }

        public static void JsonToSkills()
        {
            var result = LoadJson();
            using (FindIT_DbContext newConnection = new FindIT_DbContext())
            {
                foreach (var item in result)
                {
                    var helpString = item.ToString();
                    var startIndex = helpString.IndexOf('['); 
                    var endIndex = helpString.IndexOf(']');
                    var subString = helpString.Substring(startIndex+1, (endIndex - startIndex-1));
                    var subStringClean1 = subString.Replace("\r\n", "");
                    var skillString = subStringClean1.Replace("\"", ",").Trim();
                    var skillArray = skillString.Split(",,");
                    if (!String.IsNullOrEmpty(skillString))
                    {
                        foreach (var text in skillArray)
                        {
                            Consultant_skills newSkill = new Consultant_skills();
                            newSkill.ConsultantId = item.id;
                            newSkill.Skill = text.Replace(",", "").Trim();
                            newConnection.ConsultantSkills.Add(newSkill);
                        }
                    }
                    else
                    {
                        Consultant_skills newSkill = new Consultant_skills();
                        newSkill.ConsultantId = item.id;
                        newConnection.ConsultantSkills.Add(newSkill);
                    }
                }
                newConnection.SaveChanges();
            }
        }

        public static void JsonToContract()
        {
            var result = LoadJson();
            using (FindIT_DbContext newConnection = new FindIT_DbContext())
            {
                foreach (var item in result)
                {
                    Contract newContract = new Contract();
                    newContract.Title = item.Title;
                    newContract.StartDate = item.StartDate;
                    Random rnd = new Random();
                    newContract.EndDate = newContract.StartDate.AddDays(rnd.Next(13,50));
                    newConnection.Contracts.Add(newContract);
                }

                newConnection.SaveChanges();
            }
        }

        public static void MockTeams()
        {
            using (FindIT_DbContext newConnection = new FindIT_DbContext())
            {
                int k = 9;
                for (int i = 10; i < 461; i++)
                {
                    Team newTeam = new Team();
                    newTeam.ConsultantId = i;
                    newTeam.ContractId = k;
                    if (i%3 == 0)
                        k += 1;
                    newConnection.Teams.Add(newTeam);
                }
                newConnection.SaveChanges();
            }
        }
    }
}
