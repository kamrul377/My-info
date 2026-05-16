

// export const personalInfo = {
//     name: "Kamrul Islam",
//     role: "System Engineer & Full-Stack Developer",
//     avatar: "./km.jpeg", // Placeholder: replace with your image asset path once local
//     bio: "A multi-disciplinary Core Network Specialist running infrastructure operations at First n Fast IT Ltd. Bridging the gap between hardware engineering and software systems by building enterprise MERN solutions, writing network automation engines, and deeply exploring cybersecurity analytics.",

//     skillCategories: [
//         {
//             title: "Core MikroTik Routing & Switching",
//             skills: ["RouterOS Core Configuration", "OSPF & iBGP/eBGP Peering", "PPPoE Server Deployment", "VLAN (802.1Q) Layer-2 Isolation"]
//         },
//         {
//             title: "MikroTik Traffic & Bandwidth Engineering",
//             skills: ["Queue Trees & Simple Queues", "PCQ (Per Connection Queue) Shaping", "Mangle & Firewall Marking", "Dual-WAN Load Balancing (PCC)"]
//         },
//         {
//             title: "Core Networking & Firewalls",
//             skills: ["Cisco & Juniper Routing/Switching", "Fortigate Firewall Compliance", "Multi-Vendor Troubleshooting", "Infrastructure Optimization"]
//         },
//         {
//             title: "Security & Automation",
//             skills: ["Ethical Hacking", "Cybersecurity Analytics", "Python Automation Scripts", "Linux Systems"]
//         },
//         {
//             title: "Core Networking & Firewalls",
//             skills: ["Cisco & Juniper Routing/Switching", "Fortigate Firewall", "Multi-Vendor Troubleshooting", "Core Infrastructure Optimization"]
//         },
//         {
//             title: "Network Certifications",
//             skills: ["CCNA", "MTCNA", "MTCRE", "MTCSE"]
//         },
//         {
//             title: "Full-Stack Software Engineering",
//             skills: ["HTML5 / CSS3 / Tailwind", "JavaScript (ES6+)", "Node.js / Express / REST APIs", "Python", "Java", "C / C++"]
//         },
//         {
//             title: "Security & Automation",
//             skills: ["Ethical Hacking", "Cybersecurity Analytics", "Network Automation Scripts", "Linux Systems"]
//         }
//     ],
//     github: "https://github.com/kamrul377", // Your actual GitHub base mapping
//     linkedin: "https://linkedin.com/in/kamrulislam377", // Your actual LinkedIn identity
//     email: "your.email@example.com",
// };
export const personalInfo = {
    name: "Kamrul Islam",
    role: "System Engineer & Full-Stack Developer",
    avatar: "/my-profile-pic.jpg", // Kept matching your root public image layout configuration
    bio: "A multi-disciplinary Core Network Specialist running infrastructure operations at First n Fast IT Ltd. Bridging the gap between hardware engineering and software systems by building enterprise MERN solutions, writing network automation engines, and deeply exploring cybersecurity analytics.",

    skillCategories: [
        {
            title: "Core MikroTik Routing & Switching",
            skills: [
                "RouterOS Core Configuration",
                "OSPF & iBGP/eBGP Peering",
                "PPPoE Server Deployment",
                "VLAN (802.1Q) Layer-2 Isolation"
            ]
        },
        {
            title: "MikroTik Traffic & Bandwidth Engineering",
            skills: [
                "Queue Trees & Simple Queues",
                "PCQ (Per Connection Queue) Shaping",
                "Mangle & Firewall Marking",
                "Dual-WAN Load Balancing (PCC)"
            ]
        },
        {
            title: "Multi-Vendor Enterprise Routing & Firewalls",
            skills: [
                "Cisco & Juniper Routing/Switching",
                "Fortigate Firewall Compliance",
                "Multi-Vendor Troubleshooting",
                "Core Infrastructure Optimization"
            ]
        },
        {
            title: "Cybersecurity & Automation Operations",
            skills: [
                "Ethical Hacking",
                "Cybersecurity Analytics",
                "Network Automation Scripts",
                "Linux Systems Deployment"
            ]
        },
        {
            title: "Full-Stack Software Engineering",
            skills: [
                "HTML5 / CSS3 / Tailwind CSS",
                "JavaScript (ES6+) & TypeScript",
                "Node.js / Express / REST APIs",
                "Python, Java, C / C++"
            ]
        },
        {
            title: "Professional Network Certifications",
            skills: [
                "CCNA (Cisco Certified Network Associate)",
                "MTCNA (MikroTik Certified Network Associate)",
                "MTCRE (MikroTik Certified Routing Engineer)",
                "MTCSE (MikroTik Certified Security Engineer)"
            ]
        }
    ],
    github: "https://github.com/kamrul377",
    linkedin: "https://www.linkedin.com/in/kamrulislam377/",
    email: "kamrul.cse9@gmail.com", // Remember to swap this with your live business email handle!
};

export const experiences = [
    {
        role: "System Engineer (Core Network Operations)",
        company: "First n Fast IT Ltd",
        period: "JAN 2025 - Present",
        description: "Architecting core network environments, executing multi-vendor hardware deployments (Cisco/Juniper/MikroTik), applying strict Fortigate firewall compliance rules, and managing systemic critical routing anomalies.",
    },
    {
        role: "Network Support Engineer",
        company: "First n Fast IT Ltd",
        period: "FEB 2024 - DEC 2024",
        description: "Monitored infrastructure performance, troublesated edge-routing faults, resolved layer-2/layer-3 connectivity dropouts, and handled tier-2 multi-vendor client tickets.",
    },
];

export const education = [
    {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "East Delta University",
        period: "Running",
    },
    {
        degree: "Computer Science & Technology",
        institution: "Chattogram Polytechnic Institute",
        period: "2019 - 2023",
    }
];


// src/data/portfolioData.ts

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    technologies: string[];
    features: string[];
    metrics: string;
    githubUrl?: string;
}

export const demoProjects: Project[] = [
    // Append this to the demoProjects array inside src/data/portfolioData.ts

    {
        id: "mikrotik-isp-core",
        title: "Carrier-Grade MikroTik Core ISP & Bandwidth Engine",
        category: "MikroTik Core Operations",
        description: "Designed and deployed a highly scalable ISP edge architecture using MikroTik RouterOS. Engineered a robust PPPoE Server framework to authenticate thousands of concurrent subscribers, utilizing specialized Mangle firewall rules, Layer 7 protocols, and Queue Trees (PCQ) to guarantee fair bandwidth distribution and dynamic speed limits.",
        technologies: ["RouterOS v7", "PPPoE Server", "Radius Auth", "Queue Trees (PCQ)", "PCC Load Balancing", "Mangle Rules"],
        features: [
            "Configured a centralized PPPoE server environment integrated with external RADIUS billing for secure, automated user access control.",
            "Built an advanced traffic prioritization matrix using Mangle rules to mark packets, ensuring low latency for real-time traffic (VoIP/Gaming) over bulk downloads.",
            "Implemented Per Connection Queue (PCQ) optimization to automatically share bandwidth equally among active users during peak hours."
        ],
        metrics: "Optimized link utilization by 40% while eliminating subscriber bandwidth starvation"
    },
    {
        id: "cybersec-zero-trust",
        title: "Enterprise Edge Hardening & Zero-Trust Architecture",
        category: "Cyber Security",
        description: "Designed and engineered an enterprise-grade security framework enforcing strict Zero-Trust Access control policies. Implemented stateful firewall inspection, automated intrusion prevention (IPS/IDS), and cryptographically secure site-to-site IPsec VPN tunnels to safeguard internal corporate assets against advanced network vectors.",
        technologies: ["Cisco ASA/Firepower", "Palo Alto NGFW", "WireGuard", "Snort IDS", "RADIUS/TACACS+"],
        features: [
            "Micro-segmentation of corporate subnets isolating high-risk database clusters.",
            "Implements Context-Aware Multi-Factor Authentication (MFA) via 802.1X Network Access Control.",
            "Configured automated real-time alert forwarding into a centralized SIEM pipeline."
        ],
        metrics: "Reduced internal network lateral attack surface by 85%"
    },
    {
        id: "ipv4-ipv6-transition",
        title: "Dual-Stack IPv4/IPv6 Enterprise Migration Engine",
        category: "Network Infrastructure",
        description: "Architected a seamless production-ready transition strategy to bridge the gap between legacy legacy architectures and modern address standards. Developed a hybrid environment utilizing concurrent Dual-Stack routing alongside automated NAT64/DNS64 translation boundaries and secure 6to4 tunneling protocols.",
        technologies: ["IPv6 Dual-Stack", "NAT64 / DNS64", "6to4 Tunneling", "Cisco IOS-XE", "Core DNS"],
        features: [
            "Zero-downtime traffic execution handling native IPv4 and IPv6 streams simultaneously.",
            "Stateful translation translation layers enabling IPv6-only nodes to reach legacy public IPv4 blocks.",
            "Optimized address mapping matrices to completely prevent path MTU discovery issues."
        ],
        metrics: "Achieved 100% address availability with 0ms transition latency"
    },
    {
        id: "multi-protocol-routing",
        title: "Hybrid Core Routing Core Topology (OSPF, EIGRP, IS-IS)",
        category: "Routing & Switching",
        description: "Engineered a complex multi-autonomous interior gateway architecture designed for maximum resilient routing. Configured dual-core backbones running Link-State IS-IS for cloud edges alongside OSPF areas for enterprise layers, tied together with precision multi-point bidirectional route redistribution matrices.",
        technologies: ["OSPFv3", "EIGRPv6", "IS-IS", "Route Redistribution", "Prefix-Lists", "Route-Maps"],
        features: [
            "Designed strict loop-prevention layers using precision Route-Maps, administrative distance fine-tuning, and prefix tracking.",
            "Fast-convergence parameters calibrated to ensure sub-second failover recovery times.",
            "Configured MD5/SHA neighbor authentication tokens across all interior adjacencies."
        ],
        metrics: "Sub-second (under 450ms) core routing reconvergence time"
    },
    {
        id: "isp-bgp-backbone",
        title: "Carrier-Grade Service Provider BGP Architecture",
        category: "Routing & Switching",
        description: "Simulated and deployed a high-scale Service Provider core infrastructure running autonomous systems. Structured scalable Internal BGP (iBGP) mesh layers using route reflectors alongside highly resilient External BGP (eBGP) peer connections with multiple upstream Tier-1 transits and local internet exchange points.",
        technologies: ["BGP (eBGP / iBGP)", "Route Reflectors", "AS-Path Manipulation", "MED / Local Pref", "BGP Communities"],
        features: [
            "Granular inbound and outbound path engineering via Local Preference optimization and AS-Path prepending.",
            "Secured edge infrastructure against prefix hijacking attacks utilizing BGP Route Filtering policies.",
            "Engineered automated dual-homed load-balancing frameworks using maximum-paths variables."
        ],
        metrics: "Maintained structural stability through full 1M+ global route table table feeds"
    },
    // Add these to the existing demoProjects array in src/data/portfolioData.ts

    {
        id: "mpls-vpn-backbone",
        title: "Carrier-Grade MPLS Layer 3 VPN Backbone Core",
        category: "Routing & Switching",
        description: "Designed and evaluated a robust Service Provider core infrastructure running Multi-Protocol Label Switching (MPLS). Engineered a scalable backbone using IS-IS as the Interior Gateway Protocol (IGP) for label distribution via LDP, utilizing MP-BGP to securely transport isolated Layer 3 VPN (L3VPN) topologies across customer edges.",
        technologies: ["MPLS", "LDP", "MP-BGP", "VRF Lite", "IS-IS Core", "Cisco IOS-XR"],
        features: [
            "Configured independent Virtual Routing and Forwarding (VRF) instances to enforce strict data plane isolation between client domains.",
            "Optimized traffic paths across the core using explicit MPLS Traffic Engineering (TE) label-switched paths.",
            "Implemented Route Target (RT) and Route Distinguisher (RD) mapping structures to manage seamless route visibility."
        ],
        metrics: "Achieved wirespeed label switching with complete routing isolation"
    },
    {
        id: "network-automation-ansible",
        title: "Automated Network Provisioning & Compliance Engine",
        category: "Network Infrastructure",
        description: "Developed a GitOps-driven network automation framework to eliminate manual CLI configurations. Built structural infrastructure-as-code playbooks utilizing Ansible and Netmiko to handle bulk state provisioning, automated golden-configuration compliance audits, and safe rolling firmware updates across multi-vendor equipment.",
        technologies: ["Ansible Core", "Netmiko / Paramiko", "Python 3", "GitLab CI/CD", "YAML Profiles", "Regex Parser"],
        features: [
            "Constructed automated playbooks that execute routine VLAN, interface, and static route updates across 100+ simulated nodes concurrently.",
            "Built an automated pre- and post-check state inspection engine to trigger automated configuration rollbacks upon failure detection.",
            "Created a Python-based custom parser to run overnight configuration auditing against centralized security baselines."
        ],
        metrics: "Reduced manual configuration delivery time by 92%"
    },
    {
        id: "dc-high-availability",
        title: "High-Availability Data Center Core Network Resiliency",
        category: "Network Infrastructure",
        description: "Engineered a loop-free, redundant Data Center design utilizing advanced Layer 2 and Layer 3 resilience mechanisms. Eliminated single points of failure by pairing core switches through Multi-Chassis EtherChannel tech while managing optimized first-hop gateways and loop protection states.",
        technologies: ["Virtual Port-Channel (vPC)", "HSRP / VRRP", "Rapid PVST+", "LACP Trunking", "Nexus NX-OS"],
        features: [
            "Configured Cisco Nexus vPC to provide multi-chassis link aggregation, doubling uplink bandwidth efficiency without inducing active bridging loops.",
            "Tuned Spanning Tree Protocol parameters (Bridge Priority, PortFast, BPDU Guard) to secure the access layer against rogue switches.",
            "Optimized First Hop Redundancy Protocols with aggressive hello/hold timers to maintain state sync."
        ],
        metrics: "Maintained continuous data-plane availability through dual link failures"
    },
    {
        id: "telemetry-monitoring",
        title: "Distributed Network Telemetry & Infrastructure Observability",
        category: "Cyber Security",
        description: "Designed a centralized enterprise-wide infrastructure monitoring stack to replace legacy polling frameworks. Built a real-time streaming telemetry pipeline utilizing gRPC network streams alongside deep syslog aggregation layers to maintain persistent visibility over link saturation, optical levels, and hardware state changes.",
        technologies: ["gRPC Telemetry", "SNMPv3", "Prometheus", "Grafana Dashboards", "InfluxDB", "Linux Server Core"],
        features: [
            "Deployed modern push-based model telemetry agents streaming interface metrics at sub-minute granular intervals.",
            "Constructed comprehensive Grafana visualization dashboards displaying live interior link utilization rates, error drops, and BGP state maps.",
            "Configured secure alert managers parsing system logs to dynamically trigger SMS or email updates for critical alerts."
        ],
        metrics: "Improved proactive anomaly detection metrics by 70%"
    },
    {
        id: "layer2-switching-loop",
        title: "Layer 2 Infrastructure Hardening & Loop Prevention",
        category: "L2 Data Link Layer",
        description: "Designed a resilient Layer 2 campus switching topology engineered to eliminate broadcast storms and bridge loops. Deployed Multiple Spanning Tree Protocol (MSTP) to map distinct VLANs to separate logical topologies, optimizing uplink bandwidth while implementing strict edge-port protection constraints.",
        technologies: ["MSTP (802.1s)", "LACP (802.3ad)", "BPDU Guard", "Root Guard", "Storm Control", "VLAN Trunking"],
        features: [
            "Segmented broadcast domains using MSTP instances, balancing active traffic paths across dual core switches.",
            "Hardened access layer ports with BPDU Guard and Root Guard to instantly disable rogue network attachments.",
            "Configured broadcast/multicast Storm Control thresholds to prevent malicious or accidental layer 2 flooding."
        ],
        metrics: "Reduced Spanning Tree convergence time to sub-second thresholds"
    },
    {
        id: "layer3-intervlan-routing",
        title: "Layer 3 Inter-VLAN Routing & Deterministic Gateway Design",
        category: "L3 Network Layer",
        description: "Architected a high-throughput Layer 3 routing topology utilizing multi-layer switches and dedicated router interfaces. Engineered deterministic packet forwarding boundaries using Router-on-a-Stick configurations for smaller branches alongside high-speed Switch Virtual Interfaces (SVIs) backed by deterministic HSRP gateway tracking.",
        technologies: ["SVI Routing", "HSRP Object Tracking", "IEEE 802.1Q", "Sub-interfaces", "Static Routing", "IP SLA"],
        features: [
            "Configured high-performance inter-VLAN line-rate routing across multi-layer switches via hardware CEF (Cisco Express Forwarding).",
            "Implemented HSRP with active WAN interface object tracking to dynamically shift local gateway priorities during link degradation.",
            "Isolated corporate department subnets via Layer 3 Access Control Lists (ACLs) to enforce network boundaries."
        ],
        metrics: "Achieved zero-packet-loss gateway failover via active interface tracking"
    },
    {
        id: "layer4-traffic-optimization",
        title: "Layer 4 Stateful Inspection & TCP Flow Optimization",
        category: "L4 Transport Layer",
        description: "Optimized end-to-end transport layer delivery and security states across an enterprise edge boundary. Engineered stateful Layer 4 firewall inspection rules to restrict traffic strictly by TCP/UDP port mapping while fine-tuning TCP window sizing and MSS parameters to eliminate WAN segmentation issues.",
        technologies: ["TCP/UDP Port Mapping", "Stateful Inspection", "MSS Clamping", "TCP Window Scaling", "Layer 4 ACLs"],
        features: [
            "Implemented Maximum Segment Size (MSS) clamping on WAN boundaries to completely eliminate MTU-based packet fragmentation.",
            "Configured strict stateful inspection tracking TCP handshakes (SYN/SYN-ACK/ACK) to stop unauthorized injection vectors.",
            "Fine-tuned TCP Window Scaling variables on core servers to maximize data throughput over high-latency long-haul fiber links."
        ],
        metrics: "Increased wide-area network data transfer efficiency by 35%"
    }
];


// Append this to src/data/portfolioData.ts

export interface FAQItem {
    question: string;
    answer: string;
}

export const faqData: FAQItem[] = [
    {
        question: "As a Core Network Specialist, what is your approach to multi-vendor integration?",
        answer: "My approach focuses heavily on open-standard routing protocols like OSPF and BGP rather than proprietary variants. For instance, when bridging MikroTik RouterOS with Cisco IOS or Juniper devices, I enforce strict interface parameter matching, careful MTU calculations, and explicit administrative distance mapping to guarantee loop-free mutual route redistribution and seamless data-plane forwarding."
    },
    {
        question: "How do you optimize subscriber bandwidth environments on MikroTik systems during peak hours?",
        answer: "Instead of relying purely on simple queues which scale poorly under thousands of concurrent active connections, I implement PCQ (Per Connection Queue) inside structured Queue Trees. By using Mangle rules to classify and mark distinct traffic types (prioritizing real-time TCP/UDP streams like DNS, VoIP, and gaming protocols over bulk HTTP downloads), the router automatically shares the global bandwidth pool equally among active subscribers, preventing network starvation."
    },
    {
        question: "How do your Full-Stack development skills tie into your System Engineering background?",
        answer: "I practice NetDevOps. By combining my full-stack MERN capabilities and Python scripting with core networking, I build tools that automate infrastructure pipelines. This includes developing custom scripts using Netmiko/Ansible to automate bulk device configurations, parsing complex syslog data into centralized tracking dashboards, and building secure web interfaces that interface directly with network router APIs."
    },
    {
        question: "What is your baseline strategy for hardening an enterprise network perimeter?",
        answer: "I enforce a Zero-Trust architecture model. This requires disabling all unused physical interface ports, applying strict Spanning Tree protection constraints (BPDU Guard, Root Guard), configuring stateful Layer 4 firewall inspection filtering rules, separating internal corporate departments via isolated Layer 3 VLAN boundaries, and requiring cryptographically secured IPsec/WireGuard VPN paths for all remote access."
    }
];