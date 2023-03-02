class CaptchaAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async CreateTask(taskData) {
        const req = await fetch("https://api.capsolver.com/createTask" , {
            method : "POST",
            body : JSON.stringify({
                clientKey : this.apiKey,
                task : taskData
            }),
            headers : {
                "Content-Type" : "application/json"
            }
        });

        const resp = await req.json();
        return resp.taskId;
    }

    async CreateHCaptchaTaskProxyless(siteKey , siteUrl) {
        const taskId = await this.CreateTask({
            type : "HCaptchaTaskProxyless",
            websiteURL : siteUrl,
            websiteKey : siteKey
        });

        return taskId;
    }

    async CreateHCaptchaTask(data) {
        const taskId = await this.CreateTask({
            type : "HCaptchaTask",
            websiteURL : data.siteUrl,
            websiteKey : data.siteKey,
            proxy : data.proxy
        });

        return taskId;
    }

    async CreateRecaptchaV2TaskProxyless(siteKey , siteUrl) {
        const taskId = await this.CreateTask({
            type : "ReCaptchaV2TaskProxyLess",
            websiteURL : siteUrl,
            websiteKey : siteKey
        });

        return taskId;
    }

    async CreateAntiCloudflareChallengeTask(data) {
        const taskId = this.CreateTask({
            type : "AntiCloudflareTask",
            websiteURL : data.siteUrl,
            websiteKey : data.siteKey,
            metadata : {
                type : "challenge"
            },
            proxy : data.proxy
        });
        return taskId;
    }

    async GetTaskResult(taskId) {
        const url = new URL("https://api.capsolver.com/getTaskResult");

        const req = await fetch(url , {
            method : "POST",
            body : JSON.stringify({
                clientKey : this.apiKey,
                taskId
            }),
            headers : {
                "Content-Type" : "application/json"
            }
        });

        const resp = await req.json();
        return resp.status === "ready" ? (resp.solution.gRecaptchaResponse || resp.solution.token) : null
    }
}
