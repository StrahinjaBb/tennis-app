package com.example.tenisApp.api.request;

import com.example.tenisApp.enums.League;

public class GetLeagueUsersRequest {
    private League league;

    public GetLeagueUsersRequest() {

    }

    public GetLeagueUsersRequest(League league) {
        this.league = league;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }
}
