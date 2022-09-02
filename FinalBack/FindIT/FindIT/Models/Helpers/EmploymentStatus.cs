using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FindIT.Models.Helpers
{
    public class EmploymentStatus
    {
        public int EmployedAmount { get; set; }
        public List<string> EmployedSkills { get; set; }
        public List<int> EmployedSkillCount { get; set; }
        public int UnemployedAmount { get; set; }
        public List<string> UnemployedSkills { get; set; }
        public List<int> UnemployedSkillCount { get; set; }
    }
}
