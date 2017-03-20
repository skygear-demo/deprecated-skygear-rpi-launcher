# Getting started with Skygear IoT on a RaspberryPi

Get started with Skygear IoT in 3 easy steps!

## 1. Prepare

Download the [Skygear IoT Raspbian image][skygear-raspbian] and
write it to a SD card by following the instructions for your respective platform:

- [Linux][sd-linux]
- [Mac OS][sd-mac]
- [Windows][sd-windows]

## 2. Access

Put the SD card in your RaspberryPi and power it up, there are several
ways of which you could access your device:

### Physical Console

Connect the RaspberryPi to a monitor and keyboard and you're all set!
We've configured the system's default keyboard layout to `us`.
Login with the user `pi` and password `raspberry`.

### SSH Console (requires Ethernet)

Connect the RaspberryPi to your network via Ethernet (Pi Zero users will need a
USB-Ethernet adaptor). The system is configured with SSH access enabled and uses DHCP
for host configuration. You will need to find your RaspberryPi's IP address by performing
a network scan.

If you're using Mac OS or Linux, you can use `nmap` to scan your network:
```
$ sudo nmap -sP 192.168.0.0/24
```
Sample output:
```
...
Host is up (0.011s latency).
MAC Address: B8:27:EB:70:9E:92 (Raspberry Pi Foundation)
Nmap scan report for 192.168.2.222
...
```
Your network and subnet mask may vary, consult your network admin if the command above doesn't work.

Now login to the RaspberryPi using `ssh`:
```
$ ssh pi@192.168.2.222
```
and enter the password `raspberry`. Replace the IP address with the one you found in the previous step.

## 3. Setup

If you wish to connect your RaspberryPi to the network via WiFi, you can do it now by following
[this guide][pi-wifi].

Edit the Skygear credentials file `/home/pi/skygear-iot/config.json` using your favourite editor
and fill in the required fields. The system already has `nano` and `vim` installed. You should
end up with something that looks like this:

```
{
  "skygear": {
    "apiKey": "734b1f4efd4c4a73a98a6d9a94cd3c55",
    "endPoint": "https://xxxxx.skygeario.com/",
    "deviceId": null,
    "password": null
  }
}

```

TODO: explain Skygear Cloud / client config here?

The system is configured to (re)start the client application upon failure every 10 seconds,
it should start automatically after you've saved a valid configuration. You can view the
application log using `sudo journalctl -u skygear-iot.service` or follow the log by adding
the `-f` switch.

```
Mar 20 09:55:46 raspberrypi systemd[1]: Starting Skygear IoT Client...
Mar 20 09:55:46 raspberrypi systemd[1]: Started Skygear IoT Client.
Mar 20 09:55:52 raspberrypi npm[1501]: Running Skygear IoT Setup...
Mar 20 09:55:52 raspberrypi npm[1501]: Skygear IoT Version: 2.0.1
Mar 20 09:55:52 raspberrypi npm[1501]: Device ID: BCM2709-a22082-00000000cda1d830-1490003752071
Mar 20 09:55:52 raspberrypi npm[1501]: Skygear Endpoint: https://xxxxx.skygeario.com/
Mar 20 09:55:52 raspberrypi npm[1501]: Registering Device...
Mar 20 09:55:54 raspberrypi npm[1501]: Done!
Mar 20 09:55:54 raspberrypi npm[1501]: Writing Config...
Mar 20 09:55:54 raspberrypi npm[1501]: Setup Complete!
Mar 20 09:56:04 raspberrypi systemd[1]: skygear-iot.service holdoff time over, scheduling restart.
Mar 20 09:56:04 raspberrypi systemd[1]: Stopping Skygear IoT Client...
Mar 20 09:56:04 raspberrypi systemd[1]: Starting Skygear IoT Client...
Mar 20 09:56:04 raspberrypi systemd[1]: Started Skygear IoT Client.
Mar 20 09:56:10 raspberrypi npm[1524]: ### Skygear IoT Client ###
Mar 20 09:56:10 raspberrypi npm[1524]: Skygear IoT Version: 2.0.1
Mar 20 09:56:10 raspberrypi npm[1524]: Device ID: BCM2709-a22082-00000000cda1d830-1490003752071
Mar 20 09:56:10 raspberrypi npm[1524]: Skygear Endpoint: https://xxxxx.skygeario.com/
Mar 20 09:56:10 raspberrypi npm[1524]: Initializing...
Mar 20 09:56:12 raspberrypi npm[1524]: Done!
Mar 20 09:56:12 raspberrypi npm[1524]: Loading User Application...
Mar 20 09:56:12 raspberrypi npm[1524]: { Error: Cannot find module '../user-app/package.json'
Mar 20 09:56:12 raspberrypi npm[1524]: at Function.Module._resolveFilename (module.js:470:15)
Mar 20 09:56:12 raspberrypi npm[1524]: at Function.Module._load (module.js:418:25)
Mar 20 09:56:12 raspberrypi npm[1524]: at Module.require (module.js:498:17)
Mar 20 09:56:12 raspberrypi npm[1524]: at require (internal/module.js:20:19)
Mar 20 09:56:12 raspberrypi npm[1524]: at main (/home/pi/skygear-iot/index.js:83:23)
Mar 20 09:56:12 raspberrypi npm[1524]: at process._tickCallback (internal/process/next_tick.js:109:7) code: 'MODULE_NOT_FOUND' }
Mar 20 09:56:12 raspberrypi npm[1524]: Falling back to default application...
Mar 20 09:56:12 raspberrypi npm[1524]: Listening for ping events...

```

The Skygear IoT client will first run an initial setup to generate a device ID and register
this device on the server. After that, it will restart and try to run the user application
normally. In this case, it will fail (because it doesn't exist) and run the built-in demo
ping-pong demo app instead.

When the demo ping-pong app is running, you should be able to test it by publishing a
`ping` event to the skygear server.
We've written a test program for this, in the `/home/pi/skygear-iot` directory, run
`npm test` and you should get an output like the following if everything is working correctly.

```
### Skygear IoT Ping Test ###
Skygear IoT Version: 2.0.1
Skygear Endpoint: https://akiroz.skygeario.com/
Device ID: BCM2709-a22082-00000000cda1d830-1490003752071
Initializing... 
Done!
Sending ping...
[pong] BCM2709-a22082-00000000cda1d830-1490003752071
```


# What's Next?

At this point, you already have an IoT device that responds to Skygear `ping` events.

Follow the [Skygear IoT tutorial][skygear-tutorial] to learn how to

- Create a user application on the device
- Save data to your Skygear server
- Write cloud functions to implement custom server-side logic
- Send push notifications to mobile devices

Or read the docs for [Skygear JS SDK here][skygear-doc].

# Production Considerations

## Securing the Devices

After setting up the device, you could either

1. Change the password for `root` and `pi`
```
$ sudo passwd pi
$ sudo passwd
```

2. Disable remote login access by running:

**DO NOT DO THIS, OTA UPDATE NOT IMPLEMENTED YET!!**

```
$ sudo systemctl disable ssh
$ sudo reboot
```
Firmware updates can be performed via Skygear IoT.


[skygear-raspbian]: http://example.com
[skygear-pi-gen]: http://example.com
[skygear-tutorial]: http://example.com
[skygear-doc]: https://docs.skygear.io/
[sd-linux]: https://www.raspberrypi.org/documentation/installation/installing-images/linux.md
[sd-mac]: https://www.raspberrypi.org/documentation/installation/installing-images/mac.md
[sd-windows]: https://www.raspberrypi.org/documentation/installation/installing-images/windows.md
[pi-wifi]: https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
