using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FindIT.Models;
using FindIT.Models.Helpers;
using Microsoft.EntityFrameworkCore;

namespace FindIT.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ContractsController : ControllerBase

    // This method collects all the relevant data to a single list from multiple(3) sql tables.

    // Get all data from Contracts table to contracts list.
    // If contracts table doesn't contain any elements, return 404 response to a user.
    // Making new list contraAndConsultsList where eventually all contract details are added and returned.
    // Inside first foreach loop, make new class ContractAndConsults and add properties from contracts list to it.
    // Each new ContractAndConsults object also contains "Consults" attribute (List)
    // Inside first foreach loop, select ConsultantId to a new int list ConsultIds if team.ContractId and contra.Id shares same value.
    // Making new list consultantList, still inside first foreach loop. This list contains Consultant objects.
    // From Consultants table, add its consult object to ConsultantList list if ConsultantId matches with consultId list's id.
    // If consultantsList received any content, Add new Object ContractConsult(gets attributes from consultantList list) to a contraAndConsults list.
    // Finally, attach contraAndConsults list to a contraAndConsultsList list so that last attribute, "Consults" is filled.

    {
        [HttpGet]
        public ActionResult<List<ContractAndConsults>> GetAll()
        {
            using (var db = new FindIT_DbContext())
            {
                List<Contract> contracts = db.Contracts.Select(contractdeal => contractdeal).ToList();

                if (!contracts.Any())
                {
                    return NotFound();
                }

                List<ContractAndConsults> contraAndConsultsList = new List<ContractAndConsults>();
                foreach (var contra in contracts)
                {
                    ContractAndConsults contraAndConsults = new ContractAndConsults();
                    contraAndConsults.Id = contra.Id;
                    contraAndConsults.Title = contra.Title;
                    contraAndConsults.CustomerId = contra.Customer_Id;
                    contraAndConsults.StartDate = contra.StartDate;
                    contraAndConsults.EndDate = contra.EndDate;
                    contraAndConsults.TotalPrice = contra.TotalPrice;
                    contraAndConsults.Consults = new List<ContractConsult>();

                    List<int?> consultIds = db.Teams.Where(team => team.ContractId == contra.Id).Select(x => x.ConsultantId).ToList();
                    List<Consultant> consultantList = new List<Consultant>();
                    foreach (int item in consultIds)
                    {
                        consultantList.Add(db.Consultants.First(consu => consu.Id == item));
                        if (consultantList.Any()) 
                        {
                            contraAndConsults.Consults.Add(new ContractConsult
                            {
                                Id = consultantList.Last().Id,
                                Name = consultantList.Last().Name,
                                Salary = consultantList.Last().Salary,
                                Experience = consultantList.Last().Experience,
                                Available = consultantList.Last().Available,
                                Details = consultantList.Last().Details
                            });
                        }
                    }
                    contraAndConsultsList.Add(contraAndConsults);
                }

                return contraAndConsultsList;
            }
        }

        // This method collects all the relevant single contract data to a object from multiple(3) sql tables.

        // Based on the user request, get single contract data from Contracts database table.
        // If contracts table doesn't contain any elements, return 404 response to a user.
        // Making new class ContractAndConsults which presents blueprint for a single object.
        // ContractAndConsults object also contains "Consults" attribute, which is an object list.
        // Select ConsultantId to a new int list consultIds if Teams.ContractId(db table) and contractdeal.Id shares same value.
        // Making new list consultantList which includes Consultant objects.
        // From Consultants table, add its consult object to consultantList list if consu.Id matches with consultIds list's id.
        // If previous object, obtained from the database is not empty, add it to consultantList list.
        // Finally, attach consultantList's content to contraAndConsults object, which is returned to the user.

        [HttpGet("{id}")]
        public ActionResult<ContractAndConsults> Get(int id)
        {
            using (var db = new FindIT_DbContext())
            {
                var contractdeal = db.Contracts.FirstOrDefault(contractdeal => contractdeal.Id == id);

                if (contractdeal == null)
                {
                    return NotFound();
                }

                ContractAndConsults contraAndConsults = new ContractAndConsults();
                contraAndConsults.Id = contractdeal.Id;
                contraAndConsults.Title = contractdeal.Title;
                contraAndConsults.CustomerId = contractdeal.Customer_Id;
                contraAndConsults.StartDate = contractdeal.StartDate;
                contraAndConsults.EndDate = contractdeal.EndDate;
                contraAndConsults.TotalPrice = contractdeal.TotalPrice;
                contraAndConsults.Consults = new List<ContractConsult>();

                List<int?> consultIds = db.Teams.Where(team => team.ContractId == contractdeal.Id).Select(x => x.ConsultantId).ToList();
                List<Consultant> consultantList = new List<Consultant>();
                foreach (int item in consultIds)
                {
                    var con = db.Consultants.First(consu => consu.Id == item);
                    if (con != null)
                    {
                        consultantList.Add(con);

                        contraAndConsults.Consults.Add(new ContractConsult
                        {
                            Id = consultantList.Last().Id,
                            Name = consultantList.Last().Name,
                            Salary = consultantList.Last().Salary,
                            Experience = consultantList.Last().Experience,
                            Available = consultantList.Last().Available,
                            Details = consultantList.Last().Details
                        });
                    }
                }

                return contraAndConsults;
            }
        }

        [HttpGet("customer")]
        public ActionResult<List<ContractAndConsults>> GetCustomerContracts(string customer)
        {
            using (var db = new FindIT_DbContext())
            {
                var contracts = db.Contracts.Where(x => x.Customer_Id == customer).ToList();

                if (!contracts.Any())
                    return NotFound();

                List<ContractAndConsults> custContraConsults = new List<ContractAndConsults>();
                foreach (var contra in contracts)
                {
                    ContractAndConsults contraAndConsults = new ContractAndConsults();
                    contraAndConsults.Id = contra.Id;
                    contraAndConsults.Title = contra.Title;
                    contraAndConsults.CustomerId = contra.Customer_Id;
                    contraAndConsults.StartDate = contra.StartDate;
                    contraAndConsults.EndDate = contra.EndDate;
                    contraAndConsults.TotalPrice = contra.TotalPrice;
                    contraAndConsults.Consults = new List<ContractConsult>();

                    List<int?> consultIds = db.Teams.Where(team => team.ContractId == contra.Id).Select(x => x.ConsultantId).ToList();
                    List<Consultant> consultantList = new List<Consultant>();
                    foreach (int item in consultIds)
                    {
                        consultantList.Add(db.Consultants.First(consu => consu.Id == item));
                        if (consultantList.Any())
                        {
                            contraAndConsults.Consults.Add(new ContractConsult
                            {
                                Id = consultantList.Last().Id,
                                Name = consultantList.Last().Name,
                                Salary = consultantList.Last().Salary,
                                Experience = consultantList.Last().Experience,
                                Available = consultantList.Last().Available,
                                Details = consultantList.Last().Details
                            });
                        }
                    }
                    custContraConsults.Add(contraAndConsults);
                }

                return custContraConsults;
            }
        }

            // Making new Consultant from ContractAndConsults object given from front-end and add to Contracts db table.

            // Making new class Contract, and add attributes to it based on user inputs. Functionality of the program requires to save changes at this point. 
            // If contract details made in front-end contains already contracts, make new class Team and add ConsultantId and ContractId to it. Add new team to the Teams table.
            // Add new contract to the Contracts table and save changes. 
            // Save changes and return "OK" to user.

        [HttpPost]
        public IActionResult Post(ContractAndConsults contractAndConsultants)
        {
            using (var db = new FindIT_DbContext())
            {
                Contract contract = new Contract();
                contract.Customer_Id = contractAndConsultants.CustomerId;
                contract.EndDate = contractAndConsultants.EndDate;
                contract.StartDate = contractAndConsultants.StartDate;
                contract.Title = contractAndConsultants.Title;
                contract.TotalPrice = contractAndConsultants.TotalPrice;
                db.Contracts.Add(contract);
                db.SaveChanges();
                if (contractAndConsultants.Consults.Any())
                {
                    foreach (var consult in contractAndConsultants.Consults)
                    {
                        Team team = new Team();
                        team.ConsultantId = consult.Id;
                        team.ContractId = db.Contracts.Select(x => x.Id).Max();
                        db.Teams.Add(team);
                    }
                }
                db.SaveChanges();
                return CreatedAtAction(nameof(Post), new string("OK"));
            }
        }

        // Update contract fields and add / delete teams table data.

        // If contract is not found, return 404 response to the user
        // Making new Contract object from contractAndConsultants object given from front-end.
        // Updating Contracts database table with new values from contract object. Only one contract is updated at the time.
        // If Teams database table's contains same ConsultId as the ContractAndConsults object given from front end, Teams table ConsultantId's are put to a new list contractTeams.
        // Looping through each consults in ContractAndConsults object got from front-end, check if Teams db ConsultantId's does not already contain consult id, then new team is added to the teams table.
        // If team from the teams table is not found from the contractAndConsultants object, then its deleted from the table.
        // Save changes and return "OK" to user.

        [HttpPut("{id}")] 
        public IActionResult Put(ContractAndConsults contractAndConsultants, int id)
        {
            using (var db = new FindIT_DbContext())
            {
                if (contractAndConsultants == null)
                {
                    return NotFound();
                }

                Contract contract = new Contract();
                contract.Id = contractAndConsultants.Id;
                contract.Customer_Id = contractAndConsultants.CustomerId;
                contract.EndDate = contractAndConsultants.EndDate;
                contract.StartDate = contractAndConsultants.StartDate;
                contract.Title = contractAndConsultants.Title;
                contract.TotalPrice = contractAndConsultants.TotalPrice;
                db.Contracts.Update(contract);

                var contractTeams = db.Teams.Where(y => y.ContractId == id).Select(x => x.ConsultantId).ToList();
                foreach (var teamConsult in contractAndConsultants.Consults)
                {
                    if (!contractTeams.Contains(teamConsult.Id))
                    {
                        Team teamAdd = new Team() { ContractId = id, ConsultantId = teamConsult.Id };
                        db.Teams.Add(teamAdd);
                    }
                }

                foreach (var teamConsult in db.Teams.Where(teamObj => teamObj.ConsultantId == id))
                {
                    if (!contractAndConsultants.Consults.Select(x => x.Id).Contains(teamConsult.ConsultantId))
                    {
                        db.Teams.Remove(teamConsult);
                    }
                }

                db.SaveChanges();
                return CreatedAtAction(nameof(Put), new string("OK"));
            }
        }

        // Deleting single contract based on the object given to the method.

        // If contract is not found, return 404 response to the user
        // Method also removes teams connected to the contract because of the database relation.

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using (var db = new FindIT_DbContext())
            {


                var contract = db.Contracts.First(contract => contract.Id == id);

                if (contract == null)
                {
                    return NotFound();
                }

                db.Contracts.Remove(contract);
                db.SaveChanges();
                return NoContent();
            }
        }

        [HttpGet("employment")]
        public ActionResult<EmploymentStatus> GetEmpStatus()
        {
            using (var db = new FindIT_DbContext())
            {
                List<Contract> empContracts =
                    db.Contracts.Where(x => x.StartDate.Date <= DateTime.Now.Date && x.EndDate.Date >= DateTime.Now.Date).ToList();

                // hae empConsultit ja skillCountit
                List<Consultant> empConsults = new List<Consultant>();
                foreach (var contra in empContracts)
                {
                    List<int?> consultIds = db.Teams.Where(team => team.ContractId == contra.Id).Select(x => x.ConsultantId).ToList();
                    foreach (int item in consultIds)
                    {
                        empConsults.Add(db.Consultants.First(consu => consu.Id == item));
                    }
                }

                int empAmount = empConsults.Count();

                List<Consultant_skills> helper = db.ConsultantSkills.ToList(); // Voiko poistaa???
                List<string> empSkills = new List<string>();
                foreach (Consultant consult in empConsults)
                {
                    foreach (string skill in consult.ConsultantSkills.Select(x => x.Skill))
                    {
                        empSkills.Add(skill);
                    }
                }

                List<string> uniqueEmpSkills = empSkills.Distinct().ToList();
                List<int> empSkillsCount = new List<int>();
                foreach (var skill in uniqueEmpSkills)
                {
                    empSkillsCount.Add(empSkills.Count(x => x == skill));
                }

                // hae unempConsultit ja skillCountit
                List<Consultant> consultants = db.Consultants.ToList();
                IEnumerable<Consultant> unempConsults =
                    consultants.Where(x => empConsults.All(y => y.Id != x.Id));

                int unempAmount = unempConsults.Count();

                List<string> unempSkills = new List<string>();
                foreach (Consultant consult in unempConsults)
                {
                    foreach (string skill in consult.ConsultantSkills.Select(x => x.Skill))
                    {
                        unempSkills.Add(skill);
                    }
                }

                List<string> uniqueUnempSkills = unempSkills.Distinct().ToList();
                List<int> unempSkillsCount = new List<int>();
                foreach (var skill in uniqueUnempSkills)
                {
                    unempSkillsCount.Add(unempSkills.Count(x => x == skill));
                }

                return new EmploymentStatus()
                {
                    EmployedAmount = empAmount,
                    EmployedSkills = uniqueEmpSkills,
                    EmployedSkillCount = empSkillsCount,
                    UnemployedAmount = unempAmount,
                    UnemployedSkills = uniqueUnempSkills,
                    UnemployedSkillCount = unempSkillsCount
                };
            }
        }
    }
}

    