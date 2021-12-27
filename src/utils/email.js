export function getMailServer(email) {
    if(email && email.indexOf("@") !== -1){
        var mailAddress = email.substr(email.indexOf("@")+1).toLowerCase()
        switch(mailAddress){
            case "gmail.com":
                return "https://mail.google.com"
            default:
                return `http://mail.${mailAddress}`
        }
    }
    return null
}