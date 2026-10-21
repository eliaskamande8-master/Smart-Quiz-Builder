-- Run this whole file in Supabase > SQL Editor.
create table topics(id serial primary key,name text not null,description text);
create table questions(
  id serial primary key,topic_id int references topics(id) on delete cascade,
  difficulty text check (difficulty in ('easy','medium','hard')),
  question_text text not null,options jsonb not null,correct_index int not null,
  explanation text not null,distractor_notes jsonb not null,
  source_type text default 'human-written');
create table attempts(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  topic_id int references topics(id),score int not null,total int not null,
  created_at timestamptz default now());

alter table topics enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
create policy "read topics" on topics for select to authenticated using (true);
create policy "read questions" on questions for select to authenticated using (true);
create policy "own attempts read" on attempts for select to authenticated using (user_id = auth.uid());
create policy "own attempts insert" on attempts for insert to authenticated with check (user_id = auth.uid());

insert into topics(name,description) values
('Cloud concepts','Benefits of the cloud, shared responsibility, service and deployment models.'),
('Architecture','Regions, availability zones, resource groups and subscriptions.'),
('Core services','Compute, storage and networking building blocks.'),
('Security & governance','Identity, access control, policy and protection of resources.');

-- distractor_notes has 4 entries (one per option); the correct option’s entry is "".
insert into questions(topic_id,difficulty,question_text,options,correct_index,explanation,distractor_notes) values
(1,'easy','A shop’s traffic jumps tenfold for one weekend, then returns to normal. Which cloud benefit lets it add capacity for the spike and release it afterwards, paying only for usage?',
 '["High availability","Elasticity","Disaster recovery","Geo-distribution"]',1,
 'Elasticity is the ability to scale resources up and down as demand changes, so cost follows actual usage.',
 '["High availability keeps a service running through failures. It is not about scaling with demand.","","Disaster recovery restores service after a major outage, not day-to-day capacity changes.","Geo-distribution places services near users in different locations. It does not resize capacity."]'),
(1,'medium','A team runs a virtual machine (IaaS) in the cloud. Who is responsible for patching the guest operating system inside it?',
 '["The cloud provider","Both equally","The customer","Nobody, it patches itself"]',2,
 'In IaaS the provider secures the physical datacenter, hosts and network, while the customer manages the guest OS, patches and applications.',
 '["The provider secures hardware, hosts and network, not the operating system you installed.","Responsibility is split by layer, not evenly. In IaaS the guest OS belongs to the customer.","","Someone must own patching. An unpatched VM is a security risk."]'),
(2,'easy','You want a logical container that holds a web app and its database so they can be managed and deleted together. What should you use?',
 '["A region","An availability zone","A resource group","A tenant"]',2,
 'A resource group is a logical container for related resources that share a lifecycle, so they can be deployed, managed and deleted as a unit.',
 '["A region is a geographic area with datacenters. It is about location, not grouping.","An availability zone is a separate datacenter inside a region, used for resilience.","","A tenant is an organisation’s identity directory, not a container for app resources."]'),
(2,'medium','An app must keep running if one datacenter inside a region fails. Which design choice addresses this directly?',
 '["Deploy across availability zones","Use a larger VM size","Put everything in one resource group","Create a second subscription"]',0,
 'Availability zones are separate datacenters with independent power, cooling and networking. Spreading instances across them protects against a single-datacenter failure.',
 '["","A bigger VM adds performance but still sits in one datacenter.","A resource group is only a management container and adds no physical resilience.","A subscription is a billing and access boundary and does not spread workloads across datacenters."]'),
(3,'easy','Which service is built to store large amounts of unstructured data such as images and video?',
 '["Azure Load Balancer","Azure Blob Storage","Azure Key Vault","Azure Virtual Network"]',1,
 'Blob Storage is object storage for unstructured data such as media, backups and logs, and it scales to very large volumes.',
 '["A load balancer distributes traffic and stores no data.","","Key Vault protects secrets, keys and certificates, not bulk media.","A virtual network provides private networking, not file storage."]'),
(3,'medium','A developer wants code to run only when a new file arrives, and to pay only while it executes. Which service fits?',
 '["Azure Virtual Machines","Azure Bastion","Azure Functions","Azure Disk Storage"]',2,
 'Azure Functions is serverless compute that runs code in response to events and bills per execution, with no servers to manage.',
 '["VMs run continuously, need OS management and are billed while allocated.","Bastion gives secure remote access to VMs and does not run application code.","","Disk storage is block storage for VMs, not a compute service."]'),
(4,'easy','Which service provides cloud identity and access management so users can sign in and be authenticated?',
 '["Azure Monitor","Azure Advisor","Azure Cost Management","Microsoft Entra ID"]',3,
 'Microsoft Entra ID is the cloud identity service that handles sign-in, authentication and single sign-on for users and apps.',
 '["Azure Monitor collects metrics and logs, not user identity.","Advisor gives best-practice recommendations and does not authenticate users.","Cost Management tracks and analyses spending.",""]'),
(4,'hard','An organisation wants to stop anyone, including Owners, from creating resources outside approved regions. Which feature enforces this?',
 '["Assigning everyone the Owner role","Azure Policy with a deny effect","A delete lock on the subscription","An Azure Monitor alert rule"]',1,
 'Azure Policy evaluates resource requests against rules. A deny effect blocks non-compliant creation whatever the requester’s role.',
 '["Owner can create resources anywhere, the opposite of the goal.","","A delete lock protects existing resources from removal. It does not control where new ones are created.","An alert notifies after the fact and does not prevent the action."]');
