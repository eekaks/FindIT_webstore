using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using FindIT.Models;

namespace FindIT.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ConsultantsController : ControllerBase
    {

        // Combining data from consultant and consultant_skills table to a new object that is ConsultAndSkills class.

        // Check if there are any consultants on GetAll method.
        // Add new object to consAndSkil list and return the list.

        [HttpGet]
        public ActionResult<List<ConsultSkillContract>> GetAll()
        {
            using (var db = new FindIT_DbContext())
            {
                List<Consultant> consultants = db.Consultants.Select(worker => worker).ToList();

                if (!consultants.Any())
                {
                    return NotFound();
                }

                List<ConsultSkillContract> workerSkillContractList = new List<ConsultSkillContract>();
                foreach (var cons in consultants)
                {
                    ConsultSkillContract workerSkillContract = new ConsultSkillContract();
                    workerSkillContract.Id = cons.Id;
                    workerSkillContract.Name = cons.Name;
                    workerSkillContract.Salary = cons.Salary;
                    workerSkillContract.Experience = cons.Experience;
                    workerSkillContract.Available = cons.Available;
                    workerSkillContract.Details = cons.Details;
                    workerSkillContract.Skills = db.ConsultantSkills.Where(skill => skill.ConsultantId == cons.Id).Select(x => x.Skill).ToList();

                    workerSkillContract.Contracts = new List<ConsultContract>();

                    List<int?> contractIds = db.Teams.Where(team => team.ConsultantId == cons.Id).Select(x => x.ContractId).ToList();
                    List<Contract> contractList = new List<Contract>();
                    foreach (int item in contractIds)
                    {
                        contractList.Add(db.Contracts.Where(contr => contr.Id == item).First());
                        if (contractList.Any())
                        {
                            workerSkillContract.Contracts.Add(new ConsultContract
                            {
                                Id = contractList.Last().Id,
                                Title = contractList.Last().Title,
                                EndDate = contractList.Last().EndDate,
                                StartDate = contractList.Last().StartDate
                            });
                        }
                    }

                    workerSkillContractList.Add(workerSkillContract);
                }

                return workerSkillContractList;
            }
        }

        // Combining data from consultant, consultant_skills and contracts table to a new object that is ConsultSkillContract.

        // Check if requested consultant id exists in the database.
        // Get data from consultant table.
        // Get consultant skills from consultant_skills table.
        // Check if teams table rows includes the consultant id and if it does, add contract data.
        // return single object.

        [HttpGet("{id}")]
        public ActionResult<ConsultSkillContract> Get(int id)
        {
            using (var db = new FindIT_DbContext())
            {
                var worker = db.Consultants.FirstOrDefault(worker => worker.Id == id);

                if (worker == null)
                {
                    return NotFound();
                }

                ConsultSkillContract workerSkillContract = new ConsultSkillContract();
                workerSkillContract.Id = worker.Id;
                workerSkillContract.Name = worker.Name;
                workerSkillContract.Salary = worker.Salary;
                workerSkillContract.Experience = worker.Experience;
                workerSkillContract.Available = worker.Available;
                workerSkillContract.Details = worker.Details;
                workerSkillContract.Skills = db.ConsultantSkills.Where(skill => skill.ConsultantId == worker.Id).Select(x => x.Skill).ToList();
                workerSkillContract.Contracts = new List<ConsultContract>();

                List<int?> contractIds = db.Teams.Where(team => team.ConsultantId == id).Select(x => x.ContractId).ToList();
                List<Contract> contractList = new List<Contract>();
                foreach (int item in contractIds)
                {
                    contractList.Add(db.Contracts.Where(contr => contr.Id == item).First());
                    if (contractList.Any())
                    {
                        workerSkillContract.Contracts.Add(new ConsultContract
                        {
                            Id = contractList.Last().Id,
                            Title = contractList.Last().Title,
                            EndDate = contractList.Last().EndDate,
                            StartDate = contractList.Last().StartDate
                        });
                    }
                }
                return workerSkillContract;
            }
        }

        // Making new Consultant from ConsultSkillContract object given from front-end and add to consultant table.

        // Get consultant skills from Consultant_skills object and add to consultant skill table. 
        // Save changes and return "OK" to user.

        [HttpPost]
        public IActionResult Post(ConsultSkillContract consultSkillContract)
        {
            using (var db = new FindIT_DbContext())
            {
                Consultant consultant = new Consultant();
                consultant.Name = consultSkillContract.Name;
                consultant.Salary = consultSkillContract.Salary;
                consultant.Experience = consultSkillContract.Experience;
                consultant.Available = consultSkillContract.Available;
                consultant.Details = consultSkillContract.Details;
                db.Consultants.Add(consultant);
                db.SaveChanges();

                if (consultSkillContract.Skills.Any())
                {
                    foreach (var skil in consultSkillContract.Skills)
                    {
                        Consultant_skills consSkill = new Consultant_skills();
                        consSkill.ConsultantId = db.Consultants.Select(x => x.Id).Max();
                        consSkill.Skill = skil;
                        db.ConsultantSkills.Add(consSkill);
                    }
                }

                db.SaveChanges();
                return CreatedAtAction(nameof(Post), new string("OK"));
            }
        }

        // Making new consultant from consultSkillContract object given from front-end.

        // if skill from the consultantSkills table is not found from the consultantSkills table, then its added to the table.
        // if skill from the consultantSkills table is not found from the consultSkillsContract object, then its deleted from the table.
        // Save changes and return "OK" to user.


        [HttpPut("{id}")] 
        public IActionResult Put(int id, ConsultSkillContract consultSkillContract)
        {
            using (var db = new FindIT_DbContext())
            {
                if (consultSkillContract == null)
                {
                    return NotFound();
                }

                Consultant consultant = new Consultant();
                consultant.Id = id;
                consultant.Name = consultSkillContract.Name;
                consultant.Salary = consultSkillContract.Salary;
                consultant.Experience = consultSkillContract.Experience;
                consultant.Available = consultSkillContract.Available;
                consultant.Details = consultSkillContract.Details;
                db.Consultants.Update(consultant);

                //Skillien lisäys & poisto
                var testailu = db.ConsultantSkills.Where(y => y.ConsultantId == id).Select(x => x.Skill).ToList();
                foreach (var skil in consultSkillContract.Skills)
                {
                    if (!testailu.Contains(skil))
                    {
                        Consultant_skills conSkill = new Consultant_skills() {ConsultantId = id, Skill = skil};
                        db.ConsultantSkills.Add(conSkill);
                    }
                }

                foreach (var skilll in db.ConsultantSkills.Where(skillObj => skillObj.ConsultantId == id))
                {
                    if (!consultSkillContract.Skills.Contains(skilll.Skill))
                    {
                        db.ConsultantSkills.Remove(skilll);
                    }
                }

                db.SaveChanges();
                return CreatedAtAction(nameof(Put), new string("OK"));
            }
        }

        // Deleting single consultant based on the object given to the method.

        // Method also removes skills connected to the consultant because of the database relation.
        // Save changes.

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) 
        {
            using (var db = new FindIT_DbContext())
            {

                var consultant = db.Consultants.First(consult => consult.Id == id);

                if (consultant == null)
                {
                    return NotFound();
                }

                db.Consultants.Remove(consultant);
                db.SaveChanges();
                return NoContent();
            }
        }

        // This method gives the user selected amount of random consultans back to front-end.
        // With null and overlap check, method remains robust even with bigger inputs. Single consultant is shown only once.

        [HttpGet("rand/{amount}")]
        public ActionResult<List<ConsultSkillContract>> GetRandom(int amount)
        {
            using (var db = new FindIT_DbContext())
            {
                List<Consultant> consultants = db.Consultants.ToList();

                if (!consultants.Any() || amount > consultants.Count()/3)
                {
                    return NotFound();
                }

                Random rnd = new Random();

                List<ConsultSkillContract> consultantsFront = new List<ConsultSkillContract>();

                while (consultantsFront.Count < amount)
                {
                    int randNum = rnd.Next(1, (int)consultants.Max(consultant => consultant.Id));
                    var worker = db.Consultants.FirstOrDefault(consultant => consultant.Id == randNum);

                    if (worker == null || consultantsFront.Select(consult => consult.Id).Contains(randNum)) 
                    {
                        continue;
                    }

                    ConsultSkillContract consultantFront = new ConsultSkillContract();
                    consultantFront.Id = worker.Id;
                    consultantFront.Name = worker.Name;
                    consultantFront.Salary = worker.Salary;
                    consultantFront.Experience = worker.Experience;
                    consultantFront.Available = worker.Available;
                    consultantFront.Details = worker.Details;
                    consultantFront.Skills = db.ConsultantSkills.Where(skill => skill.ConsultantId == worker.Id).Select(x => x.Skill).ToList();

                    consultantsFront.Add(consultantFront);
                }

                return consultantsFront;

            }
        }
    }
}

