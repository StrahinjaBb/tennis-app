package com.example.tenisApp.dto.conversion;

import com.example.tenisApp.api.models.AppointmentApiModel;
import com.example.tenisApp.dto.AppointmentDTO;
import com.example.tenisApp.model.Appointment;

public class AppointmentConversionUtils {
    //  api -> dto
    public static AppointmentDTO apiToDto(AppointmentApiModel apiModel) {
        AppointmentDTO appointmentDTO = new AppointmentDTO();
        appointmentDTO.setId(apiModel.getId());
        appointmentDTO.setUser(UserConversionUtils.apiToDTO(apiModel.getUser()));
        appointmentDTO.setStartTime(apiModel.getStartTime());
        appointmentDTO.setEndTime(apiModel.getEndTime());
        return appointmentDTO;
    }
    //  api -> db
    public static Appointment apiToDb(AppointmentApiModel apiModel) {
        Appointment appointment = new Appointment();
        appointment.setUser(UserConversionUtils.apiModelToDbModel(apiModel.getUser()));
        appointment.setStartTime(apiModel.getStartTime());
        appointment.setEndTime(apiModel.getEndTime());
        appointment.setAppointmentName(apiModel.getAppointmentName());
        return appointment;
    }
    //  db -> dto
//    public static Appointment dtoToDb(AppointmentDTO appointmentDTO) {
//        Appointment appointment = new Appointment();
//        appointment.setUser();
//    }
    //  dto -> db
    //  db -> api
    //  dto -> api
}
