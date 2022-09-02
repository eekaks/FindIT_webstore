using System;
using System.Collections.Generic;

#nullable disable

namespace FindIT.Models
{
    public partial class Consultant_skills
    {
        public int? Id { get; set; }
        public int? ConsultantId { get; set; }
        public string Skill { get; set; }

        public virtual Consultant Consultant { get; set; }
    }
}
