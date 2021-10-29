//========================================================================== 
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。 
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。 
// 作者：			SuperMap WebClient Team 
// 修改：	 
// 文件名：			SuperMap.Web.Realspace.Utility.js  
// 功能：			 辅助类库  
// 最后修改时间：
//==========================================================================
Type.registerNamespace("SuperMap.Web.Realspace");
SuperMap.Web.Realspace.Utility = function(){
	// <summary>公用函数集合。</summary>
	// <returns type="object">返回一个 object 对象。</returns>
};
SuperMap.Web.Realspace.Utility.registerClass('SuperMap.Web.Realspace.Utility', null, Sys.IDisposable);

// 全局变量，内部使用不必公开
SuperMap.Web.Realspace.Utility._SceneControl = null;

//将框架抛出的异常转换为realspace的异常
SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace = function(SysException){
			var ex = new Error();
			if(SysException.name == "Sys.ArgumentException")
			{			 
				 ex.name = SuperMap.Web.Realspace.ExceptionName.ArgumentIllegal;
				 ex.message = SysException.message.replace(/Sys.ArgumentException/,"ArgumentIllegal"); // 将来最好是国际化的
			}
			else if(SysException.name == "Sys.ArgumentNullException")
			{			 
				 ex.name = SuperMap.Web.Realspace.ExceptionName.ArgumentNullIllegal;
				 ex.message = SysException.message.replace(/Sys.ArgumentNullException/,"ArgumentNullIllegal");
			}
			else if(SysException.name == "Sys.ArgumentOutOfRangeException")
			{			 
				 ex.name = SuperMap.Web.Realspace.ExceptionName.ArgumentOutOfRange;
				 ex.message = SysException.message.replace(/Sys.ArgumentOutOfRangeException/,"ArgumentOutOfRange");
			}
			else if(SysException.name == "Sys.ArgumentTypeException")
			{			 
				 ex.name = SuperMap.Web.Realspace.ExceptionName.ArgumentTypeIllegal;
				 ex.message = SysException.message.replace(/Sys.ArgumentTypeException/,"ArgumentTypeIllegal");
			}
			else if(SysException.name == "Sys.ParameterCountException")
			{			 
				 ex.name = SuperMap.Web.Realspace.ExceptionName.ParameterCountIllegal;
				 ex.message = SysException.message.replace(/Sys.ParameterCountException/,"ParameterCountIllegal");
			}
			else if(SysException.name == "Sys.ArgumentUndefinedException")
			{			 
				 ex.name = SuperMap.Web.Realspace.ExceptionName.ArgumentUndefinedIllegal;
				 ex.message = SysException.message.replace(/Sys.ArgumentUndefinedException/,"ArgumentUndefinedIllegal");
			}
			return ex;
};

SuperMap.Web.Realspace.Utility._getLibVersion = function()
{
    return "8.1.0.14124";
};

SuperMap.Web.Realspace.Utility.projectionTranslate = function(Pnt2D, prjSrcInfo, prjDesInfo)
{
	if (SuperMap.Web.Realspace.Utility._SceneControl != null)
	{
		var SRPnt = SuperMap.Web.Core.Conversion._ConvertObject2SRObject(Pnt2D);
		SuperMap.Web.Realspace.Utility._SceneControl._get_innerSceneControl().ProjectionTranslate(SRPnt, prjSrcInfo, prjDesInfo);
		return new SuperMap.Web.Core.Point2D(SRPnt.X, SRPnt.Y);
	}
	
	return null;
};

var DATA_MIN = -657434;
var DATA_MAX = 2958465;
var SECOND_HALF = 1.0/172800.0;
var g_nMonthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

SuperMap.Web.Realspace.Utility.convertDateToDouble = function(date)
{
    var nYear = date.getYear();
    var nMonth = date.getMonth();
    var nDay = date.getDate();
    var nHour = date.getHours();
    var nMin = date.getMinutes();
    var nSec = date.getSeconds();
    
    // Validate year and month (ignore day of week and milliseconds)
    if (nYear > 9999 || nMonth < 1 || nMonth > 12)
        return ;

    //  Check for leap year and set the number of days in the month
    var bLeapYear = ((nYear & 3) == 0) &&((nYear % 100) != 0 || (nYear % 400) == 0);

    var nDaysInMonth = g_nMonthDays[nMonth] - g_nMonthDays[nMonth-1] + ((bLeapYear && nDay == 29 && nMonth == 2) ? 1 : 0);

    // Finish validating the date
    if (nDay < 1 || nDay > nDaysInMonth ||nHour > 23 || nMin > 59 ||nSec > 59)
        return ;

    // Cache the date in days and time in fractional days
    var nDate=0;
    var dblTime=0;

    //It is a valid date; make Jan 1, 1AD be 1
    nDate = Math.floor(nYear*365 + nYear/4 - nYear/100 + nYear/400 + g_nMonthDays[nMonth-1] + nDay);

    //  If leap year and it's before March, subtract 1:
    if (nMonth <= 2 && bLeapYear)
        --nDate;

    //  Offset so that 12/30/1899 is 0
    nDate -= 693959;

    dblTime = ((nHour * 3600) +  // hrs in seconds
        (nMin * 60) +  // mins in seconds
        (nSec)) / 86400.0;

    m_time = nDate + ((nDate >= 0) ? dblTime : -dblTime);

    return m_time;
}

SuperMap.Web.Realspace.Utility.convertDoubleToDate = function(m_time)
{
    var tm_year;
	var tm_mon;
	var tm_mday;
	var tm_hour;
	var tm_min;
	var tm_sec;
	if (m_time > DATA_MAX || m_time < DATA_MIN) 
	{
	    tm_year = 1899;
		tm_mon = 12;
		tm_mday = 30;
		tm_hour = 0;
		tm_min = 0;
		tm_sec = 0;
		return new Date(tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec);
	}
	
	var lDaysAbs=0;    //Absolute Days
	var lSecWithinDay=0;       
	var lMntWithinDay=0;     
	var l4oo_Years=0;        
	var l4oo_Century=0;       
	var l4_Years=0;           
	var l4_Day=0;             		
	var l4_Yr=0;              
	var bHop4 = true;    
	var date = m_time; 

	date += ((m_time > 0.0) ? SECOND_HALF : -SECOND_HALF);

	lDaysAbs = Math.floor(date) + 693959; 

	date = Math.abs(date);
	lSecWithinDay = Math.floor((date - Math.floor(date)) * 86400);

	l4oo_Years = Math.floor(lDaysAbs / 146097);

	lDaysAbs %= 146097;

	l4oo_Century = Math.floor((lDaysAbs - 1) / 36524);

	if (l4oo_Century != 0)
	{
		lDaysAbs = (lDaysAbs - 1) % 36524;

		l4_Years = Math.floor((lDaysAbs + 1) / 1461);

		if (l4_Years != 0)
			l4_Day = Math.floor((lDaysAbs + 1) % 1461);
		else
		{
			bHop4 = false;
			l4_Day = Math.floor(lDaysAbs);
		}
	}
	else
	{
		l4_Years = Math.floor(lDaysAbs / 1461);
		l4_Day = Math.floor(lDaysAbs % 1461);
	}

	if (!bHop4)
	{
		l4_Yr = Math.floor(l4_Day / 365);
		l4_Day %= 365;
	}
	else
	{
		l4_Yr = Math.floor((l4_Day - 1) / 365);
		if (l4_Yr != 0)
		{
			l4_Day = (l4_Day - 1) % 365;
		}
	}
	tm_year = l4oo_Years * 400 + l4oo_Century * 100 + l4_Years * 4 + l4_Yr;

	if (l4_Yr == 0 && bHop4)
	{
		if (l4_Day == 59)
		{
			tm_mon = 2;
			tm_mday = 29;
			if (lSecWithinDay != 0)
            {
	            tm_sec = lSecWithinDay % 60;
	            lMntWithinDay = Math.floor(lSecWithinDay / 60);
	            tm_min = lMntWithinDay % 60;
	            tm_hour = Math.floor(lMntWithinDay / 60);
            }
            else
            {
	            tm_hour = tm_min = tm_sec = 0;
            }

            return new Date(tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec);
		}

		if (l4_Day >= 60)
		{
			l4_Day--;
		}
	}

	l4_Day++;

	for (tm_mon = (l4_Day >> 5) + 1; l4_Day > g_nMonthDays[tm_mon]; tm_mon++);
	
	tm_mday = (l4_Day - g_nMonthDays[tm_mon-1]);

	if (lSecWithinDay != 0)
	{
		tm_sec = lSecWithinDay % 60;
		lMntWithinDay = Math.floor(lSecWithinDay / 60);
		tm_min = lMntWithinDay % 60;
		tm_hour = Math.floor(lMntWithinDay / 60);
	}
	else
	{
		tm_hour = tm_min = tm_sec = 0;
	}
	return new Date(tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec);
}
