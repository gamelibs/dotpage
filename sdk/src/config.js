const isProxy = true;
const baseUrl = isProxy ? "http://localhost:13258" : "https://save.gameslog.top";
         
export const CONFIG = {
    isProxy,
    SERVER_URL: baseUrl,
    TEST_URL: `${baseUrl}/api/health`,
    LOCAL_MODE: true,
    DEBUG: false
};

export const DOT_NAME = {
    USER_ID: "user_id",
    GAME_ENTER: "game_enter",
    GAME_UPTIME: "game_uptime",
    GAME_SCORE: "game_score",
    GAME_LEVEL: "game_level",
    SOUND_PAUSED: "sound_paused", 
    SOUND_RESUMED: "sound_resumed",
    ADS_OPENED: "ads_opened",
    ADS_CLOSED: "ads_closed",
    FPS_SET: "fps_set",
    DIFFICULTY_SET: "difficulty_set"
};