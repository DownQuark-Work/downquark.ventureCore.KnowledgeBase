/** USAGE: `% deno run --allow-run --allow-env __PiniaMigrationFilesRaw.ts`
 * 
 * This file quickly formats all data for the pinia migration
 * 
 * Use VSCODE IDE to do the following FIND ALL, DO NOT include any surrounding lines 
 * FIND ALL: `@/store/modules/(\w+).module`
 * exclude files: `*.spec.*, *.yml, router/index.ts, store/modules`
 * - currently: 262 results - 130 files
 * 
 * IF getting odd results:
 * MAKE SURE >
 * > DO NOT include any surrounding lines 
 * 
 * WHEN FINISHED OBTAINING THE RESULTS:
 * Paste the result into `__PiniaMigrationFiles.ts` where required
 * - exclude files: `*.spec.*, *.yml, router/index.ts`
 * - findall: `@/store/modules/(\w+).module`
 */
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js"

let rawFindAllInfo // populate below fof ease of use

const convert = () => {
  rawFindAllInfo = rawFindAllInfo
    .replace(/"/gm,"'")
    .replace(/^.+results.+files$/gm,'')
    .replace(/^(src.+):$/gm,'],\'$1\':[')
    .replace(/^\s+\d+: import[\s\w]+('[@/.\w\d-]+').*$/gm,'$1,')
    .replace('],','{')
    .replace(/\s[\s\S]?(\s)/gm,'$1')
    .replace(/],'/gm,'],\r\'')
    .replace(/'@/gm,'\t\'@')
    rawFindAllInfo += ']}'
}


async function copyToClipboard(text: string): Promise<void> {
  const cmd = {
    "darwin": ["pbcopy"],
    "linux": ["xclip", "-selection", "clipboard", "-i"],
    "windows": ["powershell", "-Command", "Set-Clipboard"],
  }[Deno.build.os];
  const process = await Deno.run({ cmd, stdin: "piped" });
  await process.stdin.write(new TextEncoder().encode(text));
  console.log('copied: ', text)
  process.stdin.close();
  await process.status();
}
async function pasteToCommandLine(): Promise<string> {
  const cmd = {
    "darwin": ["pbpaste"],
    "linux": ["xclip", "-selection", "clipboard", "-o"],
    "windows": ["powershell", "-Command", "Get-Clipboard"],
  }[Deno.build.os];

  const process = await Deno.run({ cmd, stdout: "piped" });
  const output = await process.output();
  process.close();
  return new TextDecoder().decode(output);
}

// rawFindAllInfo = `INSERT_HERE should start with something like: 262 results - 130 files`
rawFindAllInfo = `262 results - 130 files

src/components/admin/BillingReportDialog.vue:
  91: import app from '@/store/modules/app.module'

src/components/admin/OnAntiCoagulantRadio.vue:
  19: import app from '@/store/modules/app.module'

src/components/admin/UserGroupCard.vue:
  51: import app from "@/store/modules/app.module";

src/components/admin/UserGroupModal.vue:
  87: import notifications from '@/store/modules/notifications.module'
  92: import app from '@/store/modules/app.module'
  93: import auth from '@/store/modules/auth.module'

src/components/admin/UserModal.vue:
  118: import clinics from '@/store/modules/clinics.module'
  122: import notifications from '@/store/modules/notifications.module'
  126: import auth from '@/store/modules/auth.module'
  127: import app from '@/store/modules/app.module'

src/components/comments/PersonalInfoCommentPanel.vue:
  51: import patients from '@/store/modules/patients.module'

src/components/common/AlertCountsIcon.vue:
  22: import transmissions from '@/store/modules/transmissions.module'

src/components/common/AlertListDetails.vue:
  86: import transmissions from '@/store/modules/transmissions.module'

src/components/common/BaseItem.vue:
  57: import auth from '@/store/modules/auth.module'
  58: import app from '@/store/modules/app.module'
  59: import exportStatusModule from '@/store/modules/export_status.module'

src/components/common/CustomDatePicker.vue:
  33: import app from '@/store/modules/app.module'

src/components/common/DeviceInfoPanel.vue:
  94: import devices from '@/store/modules/devices.module'
  95: import patients from '@/store/modules/patients.module'
  98: import transmissions from '@/store/modules/transmissions.module'

src/components/common/DynamicFields.vue:
  205: import patients from '@/store/modules/patients.module'
  210: import notifications from '@/store/modules/notifications.module'
  211: import app from '@/store/modules/app.module'

src/components/common/DynamicForm.vue:
  47: import app from '@/store/modules/app.module'

src/components/common/EulaModal.vue:
  48: import auth from '@/store/modules/auth.module'

src/components/common/GenericWarning.vue:
  32: import warnings from '@/store/modules/warnings.module'
  33: import transmissions from '@/store/modules/transmissions.module'

src/components/common/LeadsManufacturersDropdown.vue:
  32: import app from '@/store/modules/app.module'

src/components/common/MergePatientsModal.vue:
  357: import patientsModule from '@/store/modules/patients.module'
  359: import FormSections from '@/store/modules/form_sections.module'

src/components/common/PatientDevicesCommentHistoryModal.vue:
  90: import notifications from '@/store/modules/notifications.module'

src/components/common/PDFViewer.vue:
  20: import notifications from '@/store/modules/notifications.module'

src/components/common/PDFViewer2.vue:
  16: import transmissions from '@/store/modules/transmissions.module'

src/components/common/PersonalInfoPanel.vue:
  281: import patients from '@/store/modules/patients.module'
  283: import app from '@/store/modules/app.module'
  286: import notifications from '@/store/modules/notifications.module'
  291: import transmissions from '@/store/modules/transmissions.module'

src/components/common/PhysicianDetail.vue:
  76: import patients from '@/store/modules/patients.module'

src/components/common/PhysiciansInfoPanel.vue:
  49: import patients from '@/store/modules/patients.module'
  50: import notifications from '@/store/modules/notifications.module'

src/components/common/SupportDashboardAddNoteModal.vue:
  75: import supportDashboardModule from '@/store/modules/support_dashboard.module'

src/components/common/SupportDashboardScreenshotModal.vue:
  36: import supportDashboardModule from '@/store/modules/support_dashboard.module'

src/components/common/TopLayoutWarning.vue:
   9: import warnings from '@/store/modules/warnings.module'
  11: import auth from '@/store/modules/auth.module'
  12: import app from '@/store/modules/app.module'

src/components/common/TransmissionDetailsHeader.vue:
  28: import patients from '@/store/modules/patients.module'

src/components/common/UserClinicsDropdown.vue:
  54: import clinics from '@/store/modules/clinics.module'

src/components/common/VendorsDropdown.vue:
  47: import app from '@/store/modules/app.module'

src/components/session_expiring/ExpiringModal.vue:
  41: import app from '@/store/modules/app.module'

src/components/transmissions/AddNoteModal.vue:
  62: import patientDeviceIssuesModule from '@/store/modules/patient_device_issues.module'
  64: import notifications from '@/store/modules/notifications.module'

src/components/transmissions/AssignUsers.vue:
  61: import transmissions from '@/store/modules/transmissions.module'
  65: import app from '@/store/modules/app.module'
  66: import auth from '@/store/modules/auth.module'

src/components/transmissions/EGMReport.vue:
  39: import app from '@/store/modules/app.module'
  40: import transmissions from '@/store/modules/transmissions.module'

src/components/transmissions/Episodes.vue:
  348: import app from '@/store/modules/app.module'
  349: import transmissions from '@/store/modules/transmissions.module'
  353: import patients from '@/store/modules/patients.module'

src/components/transmissions/ManualInclinic.vue:
  451: import transmissions from '@/store/modules/transmissions.module'
  455: import notifications from '@/store/modules/notifications.module'
  460: import patientsModule from '@/store/modules/patients.module'
  462: import app from '@/store/modules/app.module'

src/components/transmissions/MissingData.vue:
  444: import transmissions from '@/store/modules/transmissions.module'
  451: import patientsModule from '@/store/modules/patients.module'
  453: import app from '@/store/modules/app.module'

src/components/transmissions/Overview.vue:
  93: import auth from '@/store/modules/auth.module'
  94: import app from '@/store/modules/app.module'

src/components/transmissions/PatientSearchAutoComplete.vue:
  51: import app from '@/store/modules/app.module'
  52: import advancedSearchModule from '@/store/modules/advanced_search.module'

src/components/transmissions/Reports.vue:
  49: import app from '@/store/modules/app.module'
  50: import transmissions from '@/store/modules/transmissions.module'

src/components/transmissions/TheCommentTab.vue:
  206: import transmissionsModule from '@/store/modules/transmissions.module'
  207: import commentTemplatesModule from '@/store/modules/comment_templates.module'
  208: import patients from '@/store/modules/patients.module'
  213: import notifications from '@/store/modules/notifications.module'
  223: import app from '@/store/modules/app.module'

src/components/transmissions/TheOPReportTab.vue:
  184: import transmissions from '@/store/modules/transmissions.module'
  189: import app from '@/store/modules/app.module'
  194: import notifications from '@/store/modules/notifications.module'

src/components/transmissions/TheSchedulingTab.vue:
  135: import transmissions from '@/store/modules/transmissions.module'
  137: import patients from '@/store/modules/patients.module'

src/components/transmissions/TransmissionsCounters.vue:
  24: import transmissions from '@/store/modules/transmissions.module'
  25: import app from '@/store/modules/app.module'

src/components/transmissions/billing/BillingCPT.vue:
  31: import transmissionsModule from '@/store/modules/transmissions.module'
  32: import app from '@/store/modules/app.module'
  33: import patients from '@/store/modules/patients.module'

src/components/transmissions/billing/BillingDisclaimers.vue:
  46: import app from '@/store/modules/app.module'
  49: import transmissionsModule from '@/store/modules/transmissions.module'

src/components/transmissions/billing/BillingHistory.vue:
  72: import transmissionsModule from '@/store/modules/transmissions.module'
  75: import app from '@/store/modules/app.module'

src/components/transmissions/billing/BillingICD.vue:
  67: import app from '@/store/modules/app.module'
  69: import transmissionsModule from '@/store/modules/transmissions.module'

src/components/transmissions/billing/BillingStatus.vue:
  16: import transmissionsModule from '@/store/modules/transmissions.module'
  17: import patients from '@/store/modules/patients.module'

src/components/transmissions/billing/DXBilling.vue:
  20: import app from '@/store/modules/app.module'
  21: import transmissionsModule from '@/store/modules/transmissions.module'

src/components/transmissions/external_data/ExternalDataModal.vue:
  79: import patients from '@/store/modules/patients.module'
  83: import notifications from '@/store/modules/notifications.module'

src/components/transmissions/history/PendingModal.vue:
  117: import transmissions from '@/store/modules/transmissions.module'
  118: import patients from '@/store/modules/patients.module'
  119: import app from '@/store/modules/app.module'

src/components/transmissions/history/TransmissionHistory.vue:
  67: import app from '@/store/modules/app.module'

src/components/transmissions/idco/IDCORawData.vue:
  27: import transmissions from '@/store/modules/transmissions.module'

src/components/transmissions/op_report/PDFSections.vue:
  43: import transmissions from '@/store/modules/transmissions.module'
  45: import notifications from '@/store/modules/notifications.module'

src/components/transmissions/scheduling/TheScheduling.vue:
  386: import app from '@/store/modules/app.module'
  388: import patientsModule from '@/store/modules/patients.module'
  390: import notifications from '@/store/modules/notifications.module'

src/components/transmissions/workflow/PreviewModal.vue:
  72: import transmissions from '@/store/modules/transmissions.module'
  74: import app from '@/store/modules/app.module'
  77: import authModule from '@/store/modules/auth.module'

src/components/transmissions/workflow/WorkflowActions.vue:
  68: import transmissions from '@/store/modules/transmissions.module'
  69: import clinics from '@/store/modules/clinics.module'
  71: import app from '@/store/modules/app.module'
  72: import warnings from '@/store/modules/warnings.module'
  73: import notifications from '@/store/modules/notifications.module'
  74: import patients from '@/store/modules/patients.module'

src/components/user_profile/AboutPage.vue:
  92: import app from '@/store/modules/app.module'

src/components/user_profile/UserProfile.vue:
  375: import app from '@/store/modules/app.module'
  376: import auth from '@/store/modules/auth.module'
  377: import warnings from '@/store/modules/warnings.module'
  380: import commentTemplatesModule from '@/store/modules/comment_templates.module'

src/filters/date_filters.ts:
  3: import app from '@/store/modules/app.module'

src/layouts/main-layout/Mainlayout.vue:
  33: import app from '@/store/modules/app.module'
  35: import auth from '@/store/modules/auth.module'

src/layouts/main-layout/sidebar/Sidebar.vue:
  26: import exportStatusModule from '@/store/modules/export_status.module'

src/layouts/main-layout/topbar/Notification.vue:
  40: import notifications from '@/store/modules/notifications.module'

src/layouts/main-layout/topbar/Topbar.vue:
  74: import clinics from '@/store/modules/clinics.module'
  75: import app from '@/store/modules/app.module'
  76: import auth from '@/store/modules/auth.module'

src/layouts/main-layout/topbar/TopBarSearch.vue:
  86: import app from '@/store/modules/app.module'

src/layouts/main-layout/topbar/TopCounters.vue:
  45: import transmissions from '@/store/modules/transmissions.module'
  46: import app from '@/store/modules/app.module'
  47: import clinics from '@/store/modules/clinics.module'

src/layouts/main-layout/topbar/UserMenu.vue:
  45: import auth from '@/store/modules/auth.module'
  46: import app from '@/store/modules/app.module'

src/mixins/common-mixin.ts:
  7: import transmissions from '@/store/modules/transmissions.module'

src/mixins/ui-mixin.ts:
  2: import app from '@/store/modules/app.module'

src/models/billing_history.model.ts:
  3: import app from '@/store/modules/app.module'

src/models/dynamic_info.model.ts:
  2: import formSectionsModule from '@/store/modules/form_sections.module'

src/models/episode.model.ts:
  3: import app from '@/store/modules/app.module'

src/models/integration_client.model.ts:
  2: import clinics from '@/store/modules/clinics.module'

src/models/patient_device_issue.model.ts:
  2: import devicesModule from '@/store/modules/devices.module'
  3: import patientsModule from '@/store/modules/patients.module'

src/models/patient_device.model.ts:
  1: import devicesModule from '@/store/modules/devices.module'

src/models/report_pdf.model.ts:
  3: import app from '@/store/modules/app.module'

src/models/setting.model.ts:
  4: import app from '@/store/modules/app.module'

src/models/transmission.model.ts:
  6: import patients from '@/store/modules/patients.module'
  8: import devices from '@/store/modules/devices.module'

src/services/advanced_search.service.ts:
  1: import app from '@/store/modules/app.module'

src/services/app.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/auth.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/billing.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/clinic.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/comment_templates.service.ts:
  4: import app from '@/store/modules/app.module'
  5: import auth from '@/store/modules/auth.module'

src/services/device.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/export_status.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/form_section.service.ts:
  3: import app from '@/store/modules/app.module'

src/services/integrations.service.ts:
  4: import app from '@/store/modules/app.module'

src/services/leads.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/logs.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/patient_device_issues.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/patient_device.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/patient.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/recall.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/reports.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/settings.service.ts:
  3: import app from '@/store/modules/app.module'

src/services/support_dashboard.service.ts:
  3: import app from '@/store/modules/app.module'

src/services/support.service.ts:
  2: import app from '@/store/modules/app.module'

src/services/transmission.service.ts:
  1: import app from '@/store/modules/app.module'

src/services/user.service.ts:
  2: import app from '@/store/modules/app.module'
  4: import auth from '@/store/modules/auth.module'

src/services/vendor_sites.service.ts:
  3: import app from '@/store/modules/app.module'

src/views/admin/AddEditClinicModal.vue:
  179: import clinics from '@/store/modules/clinics.module'
  180: import notifications from '@/store/modules/notifications.module'

src/views/admin/AddEditPatientModal.vue:
  313: import app from '@/store/modules/app.module'
  317: import patients from '@/store/modules/patients.module'
  319: import notifications from '@/store/modules/notifications.module'
  321: import devices from '@/store/modules/devices.module'
  322: import FormSections from '@/store/modules/form_sections.module'

src/views/admin/Clinics.vue:
  235: import auth from '@/store/modules/auth.module'
  236: import app from '@/store/modules/app.module'
  237: import notifications from '@/store/modules/notifications.module'

src/views/admin/ConfigurationEntry.vue:
  147: import app from '@/store/modules/app.module'

src/views/admin/Configurations.vue:
  282: import notifications from '@/store/modules/notifications.module'

src/views/admin/IntegrationConfigurations.vue:
  100: import app from '@/store/modules/app.module'

src/views/admin/IntegrationDetails.vue:
  67: import notifications from '@/store/modules/notifications.module'
  70: import app from '@/store/modules/app.module'

src/views/admin/IntegrationModal.vue:
  66: import auth from '@/store/modules/auth.module'

src/views/admin/Integrations.vue:
  90: import app from '@/store/modules/app.module'
  94: import notifications from '@/store/modules/notifications.module'

src/views/admin/Logs.vue:
  128: import app from '@/store/modules/app.module'
  136: import notifications from '@/store/modules/notifications.module'
  137: import clinicsModule from '@/store/modules/clinics.module'

src/views/admin/PatientForm.vue:
  213: import FormSections from '@/store/modules/form_sections.module'

src/views/admin/PatientList.vue:
  199: import app from '@/store/modules/app.module'
  204: import notifications from '@/store/modules/notifications.module'
  209: import clinicsModule from '@/store/modules/clinics.module'

src/views/admin/SupportDashboard.vue:
  207: import supportDashboardModule from '@/store/modules/support_dashboard.module'
  208: import app from '@/store/modules/app.module'
  211: import notifications from '@/store/modules/notifications.module'

src/views/admin/Users.vue:
  220: import auth from '@/store/modules/auth.module'
  221: import app from '@/store/modules/app.module'
  224: import notifications from '@/store/modules/notifications.module'
  228: import clinicsModule from '@/store/modules/clinics.module'

src/views/frontend/AddMissedTransmissionsModal.vue:
  525: import patientDeviceIssuesModule from '@/store/modules/patient_device_issues.module'
  530: import notifications from '@/store/modules/notifications.module'
  534: import patientsModule from '@/store/modules/patients.module'
  537: import app from '@/store/modules/app.module'

src/views/frontend/AdvancedSearch.vue:
  395: import advancedSearchModule from '@/store/modules/advanced_search.module'
  396: import clinicsModule from '@/store/modules/clinics.module'
  397: import app from '@/store/modules/app.module'
  408: import notifications from '@/store/modules/notifications.module'

src/views/frontend/AssignedToMeSearch.vue:
  490: import transmissions from '@/store/modules/transmissions.module'
  491: import app from '@/store/modules/app.module'
  495: import notifications from '@/store/modules/notifications.module'
  500: import clinicsModule from '@/store/modules/clinics.module'

src/views/frontend/BulkClose.vue:
  56: import transmissions from '@/store/modules/transmissions.module'
  57: import app from '@/store/modules/app.module'

src/views/frontend/BulkDismiss.vue:
  53: import app from '@/store/modules/app.module'
  54: import transmissions from '@/store/modules/transmissions.module'

src/views/frontend/ExportStatus.vue:
  130: import exportStatusModule from '@/store/modules/export_status.module'
  135: import notifications from '@/store/modules/notifications.module'
  136: import app from '@/store/modules/app.module'
  137: import auth from '@/store/modules/auth.module'
  138: import clinicsModule from '@/store/modules/clinics.module'

src/views/frontend/InClinicList.vue:
  347: import transmissions from '@/store/modules/transmissions.module'
  348: import app from '@/store/modules/app.module'
  354: import notifications from '@/store/modules/notifications.module'
  357: import clinicsModule from '@/store/modules/clinics.module'
  360: import auth from '@/store/modules/auth.module'
  361: import clinics from '@/store/modules/clinics.module'

src/views/frontend/InclinicUpload.vue:
  134: import notifications from '@/store/modules/notifications.module'

src/views/frontend/MissedTransmissions.vue:
  321: import app from '@/store/modules/app.module'
  325: import notifications from '@/store/modules/notifications.module'
  326: import patientDeviceIssuesModule from '@/store/modules/patient_device_issues.module'
  333: import auth from '@/store/modules/auth.module'
  338: import clinicsModule from '@/store/modules/clinics.module'

src/views/frontend/MissedTransmissionsConfig.vue:
  88: import app from '@/store/modules/app.module'
  89: import notifications from '@/store/modules/notifications.module'

src/views/frontend/Recalls.vue:
  127: import notifications from '@/store/modules/notifications.module'
  129: import auth from '@/store/modules/auth.module'

src/views/frontend/ReportSearch.vue:
  441: import app from '@/store/modules/app.module'
  450: import clinicsModule from '@/store/modules/clinics.module'
  453: import notifications from '@/store/modules/notifications.module'

src/views/frontend/TransmissionDetail.vue:
  303: import transmissions from '@/store/modules/transmissions.module'
  328: import formSectionsModule from '@/store/modules/form_sections.module'
  330: import app from '@/store/modules/app.module'
  331: import patients from '@/store/modules/patients.module'
  332: import warnings from '@/store/modules/warnings.module'

src/views/frontend/TransmissionList.vue:
  491: import transmissions from '@/store/modules/transmissions.module'
  492: import app from '@/store/modules/app.module'
  497: import notifications from '@/store/modules/notifications.module'
  502: import auth from '@/store/modules/auth.module'
  503: import clinics from '@/store/modules/clinics.module'

src/views/frontend/TransmissionSearch.vue:
  449: import transmissions from '@/store/modules/transmissions.module'
  450: import app from '@/store/modules/app.module'
  455: import notifications from '@/store/modules/notifications.module'
  457: import clinicsModule from '@/store/modules/clinics.module'
  460: import auth from '@/store/modules/auth.module'
`

// DO NOT ERASE BELOW
convert()

await copyToClipboard(`export const piniaNestedModules = ${rawFindAllInfo}`)
console.log(chalk.gray(rawFindAllInfo), chalk.bgGray('\n\thas been copied to the clipboard'))
console.log('\n\nPaste the result into ',chalk.blue('__PinaMigrationFiles.ts'), 'at the line marked', chalk.green.bold('`//// HERE`'))
console.log('\n\nWould you like to run the first migration?: (Yn)')

const runMigratePrompt = prompt('\n\t', chalk.hex('#FFA500').underline('deno run --allow-read --allow-write --allow-env --unstable __PiniaMigrate.ts 0'))

if(runMigratePrompt?.[0] !== 'n'){
  await copyToClipboard(`deno run --allow-read --allow-write --allow-env __PiniaMigrate.ts 0`)
  console.log('The command is in your clipboard -  paste it and run it')
}

Deno.exit()