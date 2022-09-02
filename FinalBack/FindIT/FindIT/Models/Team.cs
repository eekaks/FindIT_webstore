using System;
using System.Collections.Generic;

#nullable disable

namespace FindIT.Models
{
    public partial class Team
    {
        public int? Id { get; set; }
        public int? ContractId { get; set; }
        public int? ConsultantId { get; set; }

        public virtual Consultant Consultant { get; set; }
        public virtual Contract Contract { get; set; }
    }
}
