package com.example.tenisApp.api.request;

import com.example.tenisApp.enums.League;

public class UpdateUserLeague {
    private League league;

    public UpdateUserLeague() {

    }

    public UpdateUserLeague(League league) {
        this.league = league;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }
}
