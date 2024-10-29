export interface AthleteStatsInterface {
    recent_ride_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
        achievement_count: number
    },
    all_ride_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
    },
    recent_run_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
        achievement_count: number
    },
    all_run_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
    },
    recent_swim_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
        achievement_count: number
    },
    all_swim_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
    },
    ytd_ride_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
    },
    ytd_run_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
    },
    ytd_swim_totals: {
        count: number
        distance: number
        moving_time: number
        elapsed_time: number
        elevation_gain: number
    }
}

export interface AthleteActivitiesInterface {
    resource_state: number | undefined
    athlete: {
        id: number,
        resource_state: number | undefined
    }
    name: string
    distance: number
    moving_time: number
    elapsed_time: number
    total_elevation_gain: number
    type: string
    sport_type: string
    workout_type: any
    id: number
    external_id: string
    upload_id: number
    start_date: string
    start_date_local: string
    timezone: string
    utc_offset: number
    start_latlng: any
    end_latlng: any
    location_city: any
    location_state: any
    location_country: string
    achievement_count: number
    kudos_count: number
    comment_count: number
    athlete_count: number
    photo_count: number
    map: {
        id: string
        summary_polyline: any
        resource_state: number
    }
    trainer: boolean
    commute: boolean
    manual: boolean
    private: boolean
    flagged: boolean
    gear_id: string
    from_accepted_tag: boolean
    average_speed: number
    max_speed: number
    average_cadence?: number
    average_watts?: number
    weighted_average_watts?: number
    kilojoules?: number
    device_watts?: boolean
    has_heartrate: boolean
    average_heartrate: number
    max_heartrate: number
    max_watts?: number
    pr_count: number
    total_photo_count: number
    has_kudoed: boolean
    suffer_score: number
}

export interface AthleteInterface {
    id: number | undefined
    username: string | undefined
    resource_state: number | undefined
    firstname: string | undefined
    lastname: string | undefined
    city: string | undefined
    state: string
    country: string
    sex: string
    premium: boolean
    created_at: string
    updated_at: string
    badge_type_id: number
    profile_medium: string
    profile: string
    friend: any
    follower: any
    follower_count: number
    friend_count: number
    mutual_friend_count: number
    athlete_type: number
    date_preference: string
    measurement_preference: string
    clubs: any[]
    ftp: any
    weight: number
}
const url = "https://www.strava.com/api/v3"
// this does our initial fetch for our strava data and currently fetches for all activities in the past week. however, there is additional informaiton 
// needed so afterwards, we call a function to get the specific activity info for each activity we fetch. 
export const fetchStravaData = async (accessToken: string) => {
    const now = new Date();

    // Calculate the date and time for 1 week ago
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Convert the date to an epoch timestamp in seconds
    const epochTimestampOneWeekAgo = Math.floor(oneWeekAgo.getTime() / 1000);
    // this try block calls weekly activities, athlete info, and all athlete activities
    try {
        // Create an array of fetch promises
        const [activitiesResponse, athleteResponse, allActivitiesResponse] = await Promise.all([
            // this promise fetches in the past week
            fetch(`${url}/athlete/activities?after=${epochTimestampOneWeekAgo}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            }),
            // this promise gets the athlete demographic data
            fetch(`${url}/athlete`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            }),
            // this gets all athlete activities
            fetch(`${url}/athlete/activities`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            })
        ]);

        // Check if all responses are OK
        if (!activitiesResponse.ok) {
            throw new Error(`Activities response status: ${activitiesResponse.status}`);
        }
        if (!athleteResponse.ok) {
            throw new Error(`Athlete response status: ${athleteResponse.status}`);
        }
        if (!allActivitiesResponse.ok) {
            throw new Error(`All activities response status: ${allActivitiesResponse.status}`);
        }

        // Parse all JSON responses
        const [activitiesJson, athleteJson, allActivitiesJson] = await Promise.all([
            activitiesResponse.json(),
            athleteResponse.json(),
            allActivitiesResponse.json()
        ]);

        // Return the results
        return { athleteJson, activitiesJson, allActivitiesJson };

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
// this function takes our api call /activities from past 7 days and returns data suitable for recharts table 1
export const getAllWeeklyStats = (weeklyActivityData: AthleteActivitiesInterface[] | any[]) => {
    let totalCaloriesWeekly = 0
    const dayCheck: { [key: number]: boolean } = {};
    const calorieData: any[] = []
    const heartRateAvgData: any[] = []
    let heartRateAvg = 0
    const currentDate: Date = new Date();
    let previousCount = 0
    let previousHeartRate = 0
    let weeklyRunningMiles = 0
    let totalWeeklyHours = 0
    const weeklyWorkoutTimes: any = []
    let weeklySufferScore = 0
    const weeklyHeartRateMaxes: any[] = []
    weeklyActivityData.forEach((activity, idx) => {
        // adding to total running distance for week
        if (activity.type == 'Run') {
            weeklyRunningMiles += activity.distance;
        }
        // add to total weekly suffer score
        weeklySufferScore += activity.suffer_score
        // push weekly workout time to the list of times
        weeklyWorkoutTimes.push({ day: `${idx + 1}`, time: Math.floor(activity.elapsed_time / 60) })
        // weekly workout time total
        totalWeeklyHours += activity.elapsed_time
        // take the first half of the string that contains the date only 
        const splitDate = activity.start_date.split('T')[0];
        weeklyHeartRateMaxes.push({
            date: splitDate,
            time: activity.max_heartrate
        })
        // convert it to a date type
        const activityDate: Date = new Date(activity.start_date)
        // find out the difference between current activity and current date
        const differenceInMilliseconds: number = currentDate.getTime() - activityDate.getTime()
        // convert the day difference to days 
        const differenceInDays: number = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        // if we've already logged an activity for the current day (double workout day)
        if (differenceInDays in dayCheck) {
            // add to our previous count so we have new daily calorie total
            previousCount += activity.calories
            previousHeartRate = Math.floor((previousHeartRate + activity.average_heartrate) / 2)
            calorieData.pop()
            heartRateAvgData.pop()
            calorieData.push({ date: splitDate, steps: previousCount })
            heartRateAvgData.push({ date: splitDate, avgHr: previousHeartRate })
        } else {
            // push a new calorie object into our weekly array
            calorieData.push({ date: splitDate, steps: activity.calories })
            // push a new heartrate object into our weekly array
            heartRateAvgData.push({ date: splitDate, avgHr: activity.average_heartrate })
            // add hashmap for current date in case there's multiple workouts
            dayCheck[differenceInDays] = true
            // add to previous count so we can account for duplicate days
            previousCount = activity.calories
            // assign to previous HR to account for duplicate days 
            previousHeartRate = activity.average_heartrate
        }
        totalCaloriesWeekly += activity.calories
        heartRateAvg += activity.average_heartrate
    })
    heartRateAvg = Math.floor(heartRateAvg / weeklyActivityData.length)

    return { calorieData, totalCaloriesWeekly, heartRateAvgData, heartRateAvg, weeklyRunningMiles, totalWeeklyHours, weeklyWorkoutTimes, weeklySufferScore, weeklyHeartRateMaxes }

}

// this takes our initial /athelete/activities call and then calls /athlete/activities to get calorie data
export const transformStrava = async (athlete: AthleteInterface, activities: AthleteActivitiesInterface[], accessToken: string) => {
    try {
        // we map over our pulled activities and call for each /activity
        const fetchCalls = activities.map(async (activity) => {
            return fetch(`${url}/activities/${activity.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`, // Use access token from session
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Unable to complete full activity pull for ${activity.id}. Res: ${response.statusText}`)
                }
                return response.json()
            }).catch(error => {
                console.error('Error fetching activity:', error);
                return null; // Return null or handle errors as needed
            })
        })
        const fullActivitiesInfo = await Promise.all(fetchCalls);
        // if we pull all activity info successfully, we consolidate for recharts graph 1
        if (fullActivitiesInfo) {
            const allWeeklyData = getAllWeeklyStats(fullActivitiesInfo)
            return allWeeklyData
        }

    } catch (error: any) {
        console.error("Error fetching athlete data:", error.message);
        return null
    }
}

// makes api call to /athletes/athleteId/stats. In strava data, this is athleteStatsStravaData
export const getAthleteStats = async (accessToken: string, athleteId: string | number) => {
    try {
        const athleteStats = await fetch(`${url}/athletes/${athleteId}/stats`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // Use access token from session
            },
        });
        if (!athleteStats.ok) {
            throw new Error(`Response status: ${athleteStats.status}`);
            return null
        }
        // 
        const athleteStatsJson = await athleteStats.json();
        return athleteStatsJson
    } catch (error: any) {
        console.error("Error fetching athlete data:", error.message);
        return null
    }
}

export const handleAllActivities = (activities: AthleteActivitiesInterface[] | any[]) => {
    const workoutTypes: any = {
        WeightTraining: [],
        Run: [],
        Hike: [],
        StairStepper: []
    }
    activities.forEach((activity) => {
        const type = activity.type
        if (type && type in workoutTypes) {
            workoutTypes[type].push(activity)
        }
    })
    const chart3Data = Object.entries(workoutTypes).map(([key, value]) => ({
        type: key,
        count: (value as any[]).length,
        fill: `var(--color-${key})`
    }));

    return { chart3Data }
}
export const handleAthleteStatsData = (athleteStatsData: AthleteStatsInterface) => {
    const totalRunQty = athleteStatsData.all_run_totals.count
    const totalRunDistance = athleteStatsData.all_run_totals.distance
    const totalRunTime = athleteStatsData.all_run_totals.elapsed_time
    return { totalRunQty, totalRunDistance, totalRunTime }
}

