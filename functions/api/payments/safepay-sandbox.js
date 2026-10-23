import {sandboxWebhook} from '../../../safepay-sandbox.mjs';
import {json} from '../../../erp-core.mjs';
export async function onRequest({request,env}){if(request.method!=='POST')return json({error:'Use POST.'},405);try{return await sandboxWebhook(request,env)}catch(e){return json({error:e.status?e.message:'Sandbox webhook could not be processed.'},e.status||500)}}
