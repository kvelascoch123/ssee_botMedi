// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');
const urlAPI = `http://186.69.209.147:9083/api/`;
const urlApiNgrok = `http://1f4ebefa6cb8.ngrok.io/api/`;

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
   function welcome(agent) {

     const wordParameter = agent.parameters.identificatorUser;    
       		const dataMedi = [{"id":1 , "name": "Radiologia"},
                    {"id":2 ,"name": "Tomografia"},
                    {"id":3 ,"name": "Imagen"},
                    {"id":4 ,"name": "Laboratorio"},
             ];
          let data = "";
    
        return axios.get(`${urlAPI}getCustomer/${wordParameter}`)
            .then((responseUser) => {
              const data_length = Object.keys(dataMedi).length;
                  for(var i = 0; i < data_length; i++){
                    data += `\n➤ *${dataMedi[i].id}. ${dataMedi[i].name}*`;
                  }	
              agent.add(`Gracias por la información *${responseUser.data.data.name}*` + `\nTe ofrecemos los siguientes servicios👇 \n${data}` + `\n\n¿Cuál deseas consultar?. \nEscribe👉  *servicio #*`);
            })
            .catch((error) => {
                console.log(error);
               	agent.setFollowupEvent('REGISTER_CUSTOMER_EVENT');

            }); 
    }
  // USERS VALIDATE
    
    function serviceChoice(agent){
       const numberServiceChoiceParam = agent.parameters.numberServiceChoice; // This param is a context
       const numberDniUserParam = agent.parameters.idnUser; // This param is a context

      // envio el contexto y debe buscar al api
      // Dellaes delservicio selecionado
      const datesMedi = [
             {"servicio_id":1, "fechas":[
                {"id":1, "nameService": "Radiologia","fecha": "Lunes 08 de junio 2020"},
                {"id":2, "nameService": "Radiologia","fecha": "Martes 09 de junio 2020"},
	            {"id":3, "nameService": "Radiologia","fecha": "Martes 16 de junio 2020"},

             ]},
               {"servicio_id":2, "fechas":[
                {"id":1, "nameService": "Tomografia","fecha": "Lunes 08 de junio 2020"},
                {"id":2, "nameService": "Tomografia","fecha": "Martes 03 de junio 2020"},
                {"id":3, "nameService": "Tomografia","fecha": "Miercoles 04 de junio 2020"},
     		  ]},
               {"servicio_id":3, "fechas":[
                {"id":1, "nameService": "Imagen","fecha": "Lunes 08 de junio 2020"},
                {"id":2, "nameService": "Imagen","fecha": "Viernes 12 de junio 2020"},
	            {"id":3, "nameService": "Imagen","fecha": "Lunes 15 de junio 2020"},

               ]},
               {"servicio_id":4, "fechas":[
                {"id":1, "nameService": "Laboratorio","fecha": "Miercoles 10 de junio 2020"},
                {"id":2, "nameService": "Laboratorio","fecha": "Jueves 11 de junio 2020"},
     		  ]},

           ];
           let data = "";
              const data_length = Object.keys(datesMedi).length;
                  for(var i = 0; i < data_length; i++){
                    if(datesMedi[i].servicio_id == (numberServiceChoiceParam)){
                    const data_By_id_length = Object.keys(datesMedi[i].fechas).length;
                    for(var j = 0; j < data_By_id_length ; j++){
                     data += `\n➤ *${datesMedi[i].fechas[j].id}. ${datesMedi[i].fechas[j].fecha}*`;
                    }
                       
                    }
                  }		   
      agent.add(`En` +datesMedi[numberServiceChoiceParam-1].fechas[0].nameService + ` disponemos citas para las siguientes fechas👇  \n${data} \n\nEscribe👉 *fecha #* para ver los horarios disponibles.`);

      // agent.add(`Buscar sevicio ` + numberServiceChoiceParam + `para usuario  ` + numberDniUserParam);
  }
      function serviceDateChoice(agent){
       const numberServiceChoiceParam = agent.parameters.serviceNumber; // This param is a context
       const numberDateChoiceParam = agent.parameters.numberDateChoice; // This param is a context
	
          const datesMedi = [
             {"servicio_id":1, "fechas":[
                {"id":1, "nameService": "Radiologia","fecha": "Lunes 08 de junio 2020", "horarios":[{"id":1, "horario":"08:30 - am"},{"id":2, "horario":"9:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Radiologia","fecha": "Martes 09 de junio 2020","horarios":[{"id":1, "horario":"09:30 - am"},{"id":2, "horario":"10:30 - am"},{"id":3, "horario":"4:30 - pm"}]},
	            {"id":3, "nameService": "Radiologia","fecha": "Martes 16 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

             ]},
               {"servicio_id":2, "fechas":[
                {"id":1, "nameService": "Tomografia","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Tomografia","fecha": "Martes 03 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":3, "nameService": "Tomografia","fecha": "Miercoles 04 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},
               {"servicio_id":3, "fechas":[
                {"id":1, "nameService": "Imagen","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Imagen","fecha": "Viernes 12 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
	            {"id":3, "nameService": "Imagen","fecha": "Lunes 15 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

               ]},
               {"servicio_id":4, "fechas":[
                {"id":1, "nameService": "Laboratorio","fecha": "Miercoles 10 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Laboratorio","fecha": "Jueves 11 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},

           ];
                 let data = "";
              const data_length = Object.keys(datesMedi).length;
                  for(var i = 0; i < data_length; i++){
                    if(datesMedi[i].servicio_id == numberServiceChoiceParam){
                    const data_By_id_length = Object.keys(datesMedi[i].fechas).length;

                      for(var j = 0; j < data_By_id_length ; j++){
                          if(datesMedi[i].fechas[j].id == numberDateChoiceParam){
                             const data_By_id_horarios_length = Object.keys(datesMedi[i].fechas[j].horarios).length;
                            for(var k = 0; k < data_By_id_horarios_length ; k++){
                              data += `\n➤ *${datesMedi[i].fechas[j].horarios[k].id}. ${datesMedi[i].fechas[j].horarios[k].horario}* `;

                            }
                          }

                      }
                       
                    }
                  }	
        agent.add(`En `+ datesMedi[numberServiceChoiceParam-1].fechas[numberDateChoiceParam-1].nameService + ` para la fecha `+ `*`+datesMedi[numberServiceChoiceParam-1].fechas[numberDateChoiceParam-1].fecha +`*`+` existen los siguientes horarios:\n${data} \n\n¿Qué horario eliges? \nEscribe👉 *hora #*`);
      }
  function serviceCheckDataCita(agent){
   const dniUserParam = agent.parameters.userIdentificator; // This param is a context
   const numberServiceParam = agent.parameters.numberService; // This param is a context
   const numberDateParam = agent.parameters.numberFecha; // This param is a context
   const numberHourParam = agent.parameters.numberHour; // This param is a context

    return axios.get(`${urlAPI}getCustomer/${dniUserParam}`)
            .then((responseUser) => {
              const datesMedi = [
             {"servicio_id":1, "fechas":[
                {"id":1, "nameService": "Radiologia","fecha": "Lunes 08 de junio 2020", "horarios":[{"id":1, "horario":"08:30 - am"},{"id":2, "horario":"9:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Radiologia","fecha": "Martes 09 de junio 2020","horarios":[{"id":1, "horario":"09:30 - am"},{"id":2, "horario":"10:30 - am"},{"id":3, "horario":"4:30 - pm"}]},
	            {"id":3, "nameService": "Radiologia","fecha": "Martes 16 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

             ]},
               {"servicio_id":2, "fechas":[
                {"id":1, "nameService": "Tomografia","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Tomografia","fecha": "Martes 03 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":3, "nameService": "Tomografia","fecha": "Miercoles 04 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},
               {"servicio_id":3, "fechas":[
                {"id":1, "nameService": "Imagen","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Imagen","fecha": "Viernes 12 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
	            {"id":3, "nameService": "Imagen","fecha": "Lunes 15 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

               ]},
               {"servicio_id":4, "fechas":[
                {"id":1, "nameService": "Laboratorio","fecha": "Miercoles 10 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Laboratorio","fecha": "Jueves 11 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},
           ];
          agent.add(`Señor(a) *${responseUser.data.data.name}*`+ ` vamos a crear la siguiente cita:  \n\nEspecialidad: *` + datesMedi[numberServiceParam-1].fechas[numberDateParam-1].nameService +`*`+`\nFecha: *` + datesMedi[numberServiceParam-1].fechas[numberDateParam-1].fecha  +`*`+ `\nHora: *` +  datesMedi[numberServiceParam-1].fechas[numberDateParam-1].horarios[numberHourParam-1].horario +`*`+`\nDeseas crear la cita (SI👍 - NO👎)`) ;
 
            })
            .catch((error) => {
                console.log(error);
                //agent.context.get('awaiting_data_customer');
                agent.add(`Error en servidor`);

            }); 
    
  }
    function serviceSuccesCita(agent){
   const dniUserParam = agent.parameters.dniUserComplete; // This param is a context

    return axios.get(`${urlAPI}getCustomer/${dniUserParam}`)
            .then((responseUser) => {
              agent.add(`Señor(a) *${responseUser.data.data.name}* ha registrado una cita en Medinuclear.\nEsta información fue enviada a su correo electronico *${responseUser.data.data.eEIEmail}* \n\nGracias por utilizar nuestro asistente virtual Medinuclear 🚑. \n\nRecuerda usar mascarilla en tiempos de COVID 😷`) ;

    }); 
    }
  function fallback(agent) {
    agent.add(`No comprendo lo que me has solicitado.`);
  }

// ONLY USERS NEWS
  function userRegisterContinue(agent) {
    	   const wordParameterName = agent.parameters.nombre; // This param is a context
   		   const dataMedi = [{"id":1 , "name": "Radiologia"},
                      {"id":2 ,"name": "Tomografia"},
                      {"id":3 ,"name": "Imagen"},
                      {"id":4 ,"name": "Laboratorio"},
                     ];
           let data = "";
              const data_length = Object.keys(dataMedi).length;
                  for(var i = 0; i < data_length; i++){
                    data += `\n➤ *${dataMedi[i].id}. ${dataMedi[i].name}*`;
                  }	
     	  agent.add(`Ahora eres miembro de nuestra comunidad ` +`*`+wordParameterName +`*`+ ` gracias por confiar en nosotros (>‿◠)✌ \nTe ofrecemos los siguientes servicios: \n${data} \n\n¿Cuál deseas consultar? \nEscribe👉 *servicio #*`);


  }
    function userRegisterYesContinue(agent) {
    	   const wordParameterNumber = agent.parameters.numberService; // This param is a context
   	 	   const datesMedi = [
             {"servicio_id":1, "fechas":[
                {"id":1, "nameService": "Radiologia","fecha": "Lunes 08 de junio 2020"},
                {"id":2, "nameService": "Radiologia","fecha": "Martes 09 de junio 2020"},
	            {"id":3, "nameService": "Radiologia","fecha": "Martes 16 de junio 2020"},

             ]},
               {"servicio_id":2, "fechas":[
                {"id":1, "nameService": "Tomografia","fecha": "Lunes 08 de junio 2020"},
                {"id":2, "nameService": "Tomografia","fecha": "Martes 03 de junio 2020"},
                {"id":3, "nameService": "Tomografia","fecha": "Miercoles 04 de junio 2020"},
     		  ]},
               {"servicio_id":3, "fechas":[
                {"id":1, "nameService": "Imagen","fecha": "Lunes 08 de junio 2020"},
                {"id":2, "nameService": "Imagen","fecha": "Viernes 12 de junio 2020"},
	            {"id":3, "nameService": "Imagen","fecha": "Lunes 15 de junio 2020"},

               ]},
               {"servicio_id":4, "fechas":[
                {"id":1, "nameService": "Laboratorio","fecha": "Miercoles 10 de junio 2020"},
                {"id":2, "nameService": "Laboratorio","fecha": "Jueves 11 de junio 2020"},
     		  ]},

           ];
           let data = "";
              const data_length = Object.keys(datesMedi).length;
                  for(var i = 0; i < data_length; i++){
                    if(datesMedi[i].servicio_id == wordParameterNumber){
                    const data_By_id_length = Object.keys(datesMedi[i].fechas).length;
                    for(var j = 0; j < data_By_id_length ; j++){
                     data += `\n➤ *${datesMedi[i].fechas[j].id}. ${datesMedi[i].fechas[j].fecha}*`;
                    }
                       
                    }
                  }		   
      agent.add(`En ` +datesMedi[wordParameterNumber-1].fechas[0].nameService + ` disponemos citas para las siguientes fechas👇  \n${data} \n\nEscribe👉 *fecha #* para ver los horarios disponibles.`);

  }
      function userRegisterCheckHours(agent) {
		// entra como parametro numero de Fecha selesionada y numero de servicio
  		const paramNumberService = agent.parameters.numberService; // This param is a context
	    const paramNumberDate = agent.parameters.numberFecha; // This param is a context
 	    const paramNameUserCita = agent.parameters.nameUserCita; // This param is a context

        const datesMedi = [
             {"servicio_id":1, "fechas":[
                {"id":1, "nameService": "Radiologia","fecha": "Lunes 08 de junio 2020", "horarios":[{"id":1, "horario":"08:30 - am"},{"id":2, "horario":"9:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Radiologia","fecha": "Martes 09 de junio 2020","horarios":[{"id":1, "horario":"09:30 - am"},{"id":2, "horario":"10:30 - am"},{"id":3, "horario":"4:30 - pm"}]},
	            {"id":3, "nameService": "Radiologia","fecha": "Martes 16 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

             ]},
               {"servicio_id":2, "fechas":[
                {"id":1, "nameService": "Tomografia","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Tomografia","fecha": "Martes 03 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":3, "nameService": "Tomografia","fecha": "Miercoles 04 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},
               {"servicio_id":3, "fechas":[
                {"id":1, "nameService": "Imagen","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Imagen","fecha": "Viernes 12 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
	            {"id":3, "nameService": "Imagen","fecha": "Lunes 15 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

               ]},
               {"servicio_id":4, "fechas":[
                {"id":1, "nameService": "Laboratorio","fecha": "Miercoles 10 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Laboratorio","fecha": "Jueves 11 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},

           ];
                 let data = "";
              const data_length = Object.keys(datesMedi).length;
                  for(var i = 0; i < data_length; i++){
                    if(datesMedi[i].servicio_id == paramNumberService){
                    const data_By_id_length = Object.keys(datesMedi[i].fechas).length;

                      for(var j = 0; j < data_By_id_length ; j++){
                          if(datesMedi[i].fechas[j].id == paramNumberDate){
                             const data_By_id_horarios_length = Object.keys(datesMedi[i].fechas[j].horarios).length;
                            for(var k = 0; k < data_By_id_horarios_length ; k++){
                              data += `\n➤ *${datesMedi[i].fechas[j].horarios[k].id}. ${datesMedi[i].fechas[j].horarios[k].horario}* `;

                            }
                          }

                      }
                       
                    }
                  }	
        agent.add(paramNameUserCita+ ` en `+ datesMedi[paramNumberService-1].fechas[paramNumberDate].nameService + ` para la fecha `+ `*`+datesMedi[paramNumberService-1].fechas[paramNumberDate-1].fecha +`*`+` existen los siguientes horarios:\n${data} \n\n¿Qué horario eliges?, \nEscribe👉 *hora #*`) ;

      }
        function userRegisterValidateCita(agent) {
		// entra como parametro numero de Fecha selesionada y numero de servicio
  		const paramNumberService = agent.parameters.numberService; // This param is a context
	    const paramNumberDate = agent.parameters.numberFecha; // This param is a context
	    const paramNumberHour = agent.parameters.numberHour; // This param is a context
	    const paramUserIdentificator = agent.parameters.userIdentificator; // This param is a context
	    const paramUserName = agent.parameters.userName; // This param is a context
	    const paramUserLastName = agent.parameters.userLastName; // This param is a context
	    const paramUserEmail = agent.parameters.userEmail; // This param is a context

        const datesMedi = [
             {"servicio_id":1, "fechas":[
                {"id":1, "nameService": "Radiologia","fecha": "Lunes 08 de junio 2020", "horarios":[{"id":1, "horario":"08:30 - am"},{"id":2, "horario":"9:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Radiologia","fecha": "Martes 09 de junio 2020","horarios":[{"id":1, "horario":"09:30 - am"},{"id":2, "horario":"10:30 - am"},{"id":3, "horario":"4:30 - pm"}]},
	            {"id":3, "nameService": "Radiologia","fecha": "Martes 16 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

             ]},
               {"servicio_id":2, "fechas":[
                {"id":1, "nameService": "Tomografia","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Tomografia","fecha": "Martes 03 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":3, "nameService": "Tomografia","fecha": "Miercoles 04 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},
               {"servicio_id":3, "fechas":[
                {"id":1, "nameService": "Imagen","fecha": "Lunes 08 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Imagen","fecha": "Viernes 12 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
	            {"id":3, "nameService": "Imagen","fecha": "Lunes 15 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},

               ]},
               {"servicio_id":4, "fechas":[
                {"id":1, "nameService": "Laboratorio","fecha": "Miercoles 10 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
                {"id":2, "nameService": "Laboratorio","fecha": "Jueves 11 de junio 2020","horarios":[{"id":1, "horario":"09:45 - am"},{"id":2, "horario":"11:30 - am"},{"id":3, "horario":"3:00 - pm"}]},
     		  ]},
           ];
          agent.add(`Señor(a) *` + paramUserName +` `+ paramUserLastName +`*`+ ` vamos a crear la siguiente cita:  \n\nEspecialidad: *` + datesMedi[paramNumberService-1].fechas[paramNumberDate-1].nameService +`*`+`\nFecha: *` + datesMedi[paramNumberService-1].fechas[paramNumberDate-1].fecha  +`*`+ `\nHora: *` +  datesMedi[paramNumberService-1].fechas[paramNumberDate-1].horarios[paramNumberHour-1].horario +`*`+`\nDeseas crear la cita (SI👍 - NO👎)`) ;
 
         // datesMedi[paramNumberService-1].fechas[paramNumberDate-1].fecha 
          
        }
  
 let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // ONLY USER NEW
  intentMap.set('Registrar User Bot - yes', userRegisterContinue);  
  intentMap.set('Registrar User Bot - yes - select.number', userRegisterYesContinue);  
  intentMap.set('Registrar User Bot - yes - select.number - custom', userRegisterCheckHours);  
  intentMap.set('Registrar User Bot - yes - select.number - custom - custom', userRegisterValidateCita);  
	
  // ONLY USERS VALIDATE
   intentMap.set('Service - select.number', serviceChoice);  
   intentMap.set('Service - select.number - custom', serviceDateChoice);  
   intentMap.set('Service - select.number - custom - select.number-hour', serviceCheckDataCita);  
   intentMap.set('Service - select.number - custom - select.number-hour - yes', serviceSuccesCita);  

  
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
