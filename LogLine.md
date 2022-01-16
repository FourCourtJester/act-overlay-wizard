# ACT Overlayplugin.dll LogLines

Below is the known corresponding `LogLine` emissions from `ACT Overlayplugin.dll` when measured by `ACTWS`. All IDs in `Fields` are measured in hexadecimal unless prefaced with `decimal`. A lot of this data I divined myself, and then found out Cactbot has way more details about reading ACT logs. You can find their [documentation here](https://github.com/quisquous/cactbot/blob/main/docs/LogGuide).

| Decimal Code | Hexadecimal Code | Description | Fields |
|---|---|---|---|
| 0 | 0 | Chat event | [code, timestamp, color, , description, ...] |
| 1 | 1 | Change zone | [code, timestamp, zone_id, zone_name] |
| 2 | 2 | Change character | [code, timestamp, character_id, character_name] |
| 3 | 3 | Add combatant | [code, timestamp, character_id, character_name, character_job, character_job_level, summoner_character_id, summoner_world_id, summoner_world_name, npc_name_id, npc_base_id, decimal_current_hp, decimal_total_hp, decimal_current_mp, decimal_total_mp, ?, ?, decimal_x, decimal_y, decimal_z, decimal_facing, ...]  |
| 4 | 4 | Remove combatant | [code, timestamp, character_id, character_name, character_job, character_job_level, summoner_character_id, summoner_world_id, summoner_world_name, npc_name_id, npc_base_id, ...] |
| 17 | 11 | Party change | [code, timestamp, party_size, ...character_ids] |
| 18 | 12 | Player stat change | [code, timestamp, ...stats] |
| 20 | 14 | Action started casting | [code, timestamp, character_id, character_name, action_id, action_name, target_id, target_name, decimal_action_cast, decimal_x, decimal_y, decimal_z, decimal_facing, heading] |
| 21 | 15 | Action casted | [code, timestamp, character_id, character_name, action_id, action_name, target_id, target_name, ?, action_damage, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, decimal_target_current_hp, decimal_target_total_hp, decimal_target_current_mp, decimal_target_total_mp, ?, ?, decimal_target_x, decimal_target_y, decimal_target_z, decimal_target_heading, decimal_current_hp, decimal_total_hp, decimal_current_mp, decimal_total_mp, ?, ?, decimal_x, decimal_y, decimal_z, decimal_facing, ?, sequence, index, ...] |
| 22 | 16 | AoE Action casted | same as above |
| 23 | 17 | Action cancelled | [code, timestamp, character_id, character_name, action_id, action_name, reason, ...]
| 24 | 18 | DoT/HoT update | [code, timestamp, target_id, target_name, action_type, ?, action_result?, decimal_current_hp, decimal_total_hp, decimal_current_mp, decimal_total_mp, ?, ?, decimal_x, decimal_y, decimal_z, decimal_facing, ...] |
| 25 | 19 | Death | [code, timestamp, character_id, character_name, source_id, source_name]
| 26 | 1A | Status added | [code, timestamp, status_id, status_name, decimal_status_duration, source_id, source_name, target_id, target_name, count, decimal_target_total_hp, decimal_source_total_hp, ...] |
| 27 | 1B | Target Icon | [code, timestamp, target_id, target_name, ?, ?, icon_id, ?, ?, ?, ...]
| 28 | 1C | Waymark changed | [code, timestamp, verb, waymark_id, source_id, source_name, decimal_x, decimal_y, decimal_z, ...]
| 29 | 1C | Player mark changed | [code, timestamp, verb, mark_id, source_id, source_name, target_id, target_name, ...]
| 30 | 1E | Status removed | [code, timestamp, status_id, status_name, decimal_status_duration, source_id, source_name, target_id, target_name, count, ...] |
| 31 | 1F | Primary Gauge change | [code, timestamp, character_id, 0, 1, 2, 3, ...] |
| 35 | 23 | Tether change | [code, timestamp, source_id, source_name, target_id, target_name, ?, ?, tether_id, ...] |
| 36 | 24 | Limit Break change | [code, value, max_level, ...] |
| 37 | 25 | Effect update | [code, timestamp, character_id, character_name, ?, decimal_current_hp, decimal_total_hp, ?, ?, ?, ?, decimal_x, decimal_y, decimal_z, decimal_facing, ?, ?, ?, ?, status_id, ?, ?, source_id, ...] |
| 38 | 26 | Status update | [code, timestamp, character_id, character_name, job_data, decimal_current_hp, decimal_total_hp, decimal_current_mp, decimal_total_mp, ?, ?, decimal_x, decimal_y, decimal_z, decimal_facing, ?, ?, ?, status_id, ?, source_id, ...] |
| 39 | 27 | Player HP change | [code, timestamp, character_id, character_name, decimal_current_hp, decimal_total_hp, decimal_current_mp, decimal_total_mp, ?, ? decimal_x, decimal_y, decimal_z, decimal_facing, ...] |
| 40 | 28 | Map change | [code, timestamp, zone_id, zone_name, area_name, sub_area_name, ...] |
| 41 | 29 | System message | [code, timestamp, ?, message_id, ...]
| 251 | FB | Debug| |
| 252 | FC | Packet dump | |
| 253 | FD | Version | |
| 254 | FE | Error | |