import React, { useRef } from 'react';
import { useVoiceAudio } from './useVoiceAudio';
import Icon from '../ui/Icon';
import { MINIGAME_3_QUESTIONS, Option } from './MiniData-3';
import LoadingScreen from '../LogIn/LoadingScreen';
import ExitConfirmationPopup from './ExitConfirmationPopup';
import CompletionMessage from './CompletionMessage';
import OptionButton from './OptionButton';
import { useMinigameLogic } from './useMinigameLogic';
import { MINIGAME_3_SUPPORT } from './MiniData-3';
import {
    AssistToolbar,
    CheckAnswerButton,
    EsText,
    HintBox,
    HowToPlayModal,
    useAnswerSelection,
    useHowToPlay,
    useSpanishSupport,
} from '../components/minigame/MinigameAssist';
import { HOW_TO_PLAY } from './howToPlay';
import {
    KAWAI_COLORS,
    KAWAI_FONTS,
    KAWAI_TEXTURES,
    MINIGAME_BACKGROUND,
    KAWAI_STYLES
} from './minigame-styles';

interface ThirdMinigameProps {
    userName: string;
}

const ThirdMinigame: React.FC<ThirdMinigameProps> = ({ userName }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    // Audio con volumen de voz regulable, refuerzo y opción lenta (#03)
    const { isPlaying, voiceVolume, setVoiceVolume, play, handleEnded } = useVoiceAudio(audioRef);

    const {
        showIntro,
        setShowIntro,
        isAnswered,
        feedback,
        showStory,
        currentDialogIndex,
        attempts,
        selectedOptionId,
        hoveredOptionId,
        setHoveredOptionId,
        isCorrectAnswer,
        showExitConfirmation,
        showCompletionMessage,
        currentQuestionIndex,
        currentQuestion,
        allQuestionsCompleted,
        progress,
        handleAnswer,
        handleExitClick,
        handleConfirmExit,
        handleCancelExit,
        handleNext,
        handleBackToMap,
        getCurrentIntroText,
        getButtonText,
    } = useMinigameLogic(userName, audioRef);

    // Apoyos de usabilidad: español (#07), pistas (#08), confirmar respuesta (#14), cómo jugar (#18)
    const support = currentQuestion ? MINIGAME_3_SUPPORT[currentQuestion.id] : undefined;
    const [showSpanish, toggleSpanish] = useSpanishSupport();
    const { showHowTo, openHowTo, closeHowTo } = useHowToPlay('sweet-sounds', !showIntro && !allQuestionsCompleted && !showCompletionMessage);
    const { pendingId, setPendingId, pendingOption, hintsUsed, takeHint, eliminatedId } = useAnswerSelection(
        currentQuestion?.id,
        currentQuestion?.options ?? [],
        isAnswered,
    );
    const fillEs = (text: string) => text;
    const introEs = support
        ? (Array.isArray(support.es.introGreeting) ? support.es.introGreeting[currentDialogIndex] ?? '' : support.es.introGreeting)
        : '';
    const feedbackEs = support
        ? fillEs(isCorrectAnswer ? support.es.correctFeedback : attempts < 2 ? support.es.wrongAttempt1 : support.es.wrongAttempt2)
        : '';
    const isQuestionPhase = !showStory && !isAnswered;

    const isIntroArray = currentQuestion && Array.isArray(currentQuestion.dialogue.introGreeting);
    const isLastDialog = currentQuestion
        ? currentDialogIndex >= (isIntroArray ? currentQuestion.dialogue.introGreeting.length - 1 : 0)
        : false;

    const audioUrl = currentQuestion?.audioUrl ?? '';
    const options = currentQuestion?.options ?? [];
    const rules = currentQuestion?.rules ?? '';
    const dialogue = currentQuestion?.dialogue ?? {
        introTitle: '',
        introGreeting: '',
        correctFeedback: '',
        wrongAttempt1: '',
        wrongAttempt2: '',
        instruction: '',
        questionHeader: '',
    };


    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 10,
        overflow: 'hidden',
        backgroundImage: `url(${MINIGAME_BACKGROUND}), ${KAWAI_TEXTURES.texturePaper}`,
        backgroundSize: 'cover, auto',
        backgroundPosition: 'center, center',
        backgroundBlendMode: 'overlay',
        fontFamily: KAWAI_FONTS.comfortaa,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: KAWAI_COLORS.textDark,
    };

    const dialogBoxStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '680px',
        minHeight: showStory ? '180px' : '100px',  // Reducido de 120px a 100px
        padding: '12px 20px',  // Reducido padding de 15px a 12px
        backgroundColor: 'rgba(247, 240, 230, 0.8)',
        backgroundImage: KAWAI_TEXTURES.texturePaper,
        borderRadius: '20px',
        boxShadow: `8px 8px 0px ${KAWAI_COLORS.panelBorder}`,
        border: `6px solid ${KAWAI_COLORS.panelBorder}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        fontSize: '1.05rem',
        zIndex: 15,
    };

    const nextButtonStyle: React.CSSProperties = {
        alignSelf: 'flex-end',
        marginTop: '10px',
        padding: '10px 30px',
        fontFamily: KAWAI_FONTS.mali,
        backgroundColor: KAWAI_COLORS.accentGreen,
        color: KAWAI_COLORS.textDark,
        border: `4px solid ${KAWAI_COLORS.panelBorder}`,
        borderRadius: '20px',
        cursor: 'pointer',
        boxShadow: `5px 5px 0px ${KAWAI_COLORS.panelBorder}`,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease-in-out',
    };

    const logoutButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        fontFamily: KAWAI_FONTS.mali,
        backgroundColor: KAWAI_COLORS.accentPink,
        color: KAWAI_COLORS.textDark,
        border: `4px solid ${KAWAI_COLORS.panelBorder}`,
        borderRadius: '20px',
        cursor: 'pointer',
        boxShadow: `5px 5px 0px ${KAWAI_COLORS.panelBorder}`,
        fontSize: '1rem',
        fontWeight: 'bold',
        zIndex: 20,
        transition: 'all 0.2s ease-in-out',
    };

    const optionsContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100px',  // Reducido de 120px a 100px
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',  // Reducido de 15px a 12px
        width: '90%',
        maxWidth: '450px',
        zIndex: 12,
        justifyContent: 'center',
    };

    const buttonText = getButtonText();

    const introText = (
        <>
            <h3 style={KAWAI_STYLES.header}>{dialogue.introTitle}</h3>
            <EsText show={showSpanish}>{support?.es.introTitle}</EsText>
            <p style={{ color: KAWAI_COLORS.textDark, fontSize: '1.1rem', lineHeight: 1.45, margin: '6px 0 0' }}>
                {getCurrentIntroText()}
            </p>
            <EsText show={showSpanish}>{fillEs(introEs)}</EsText>
            {isLastDialog && (
                <div style={{ marginTop: '10px', fontSize: '1.05rem', color: KAWAI_COLORS.textDark }}>
                    <p style={{ margin: 0 }}><b>Rules:</b> {rules}</p>
                    <EsText show={showSpanish}>Reglas: {support?.es.rules}</EsText>
                    <p style={{ margin: '4px 0 0' }}><b>Bonus:</b> You have 2 chances to guess.</p>
                    <EsText show={showSpanish}>Tienes 2 oportunidades para responder.</EsText>
                </div>
            )}
            <p style={{ marginTop: '8px', fontSize: '0.95rem', color: KAWAI_COLORS.textDark }}>
                Press <b>{buttonText.replace(/\*\*/g, '')}</b> to continue.
                {showSpanish && <span className="tt-mg-es"> Presiona el botón para continuar.</span>}
            </p>
        </>
    );

    const questionText = (
        <>
            <p style={{
                ...KAWAI_STYLES.instruction,
                margin: '0 0 5px 0',
            }}>
                {dialogue.instruction}
            </p>
            <EsText show={showSpanish}>{support?.es.instruction}</EsText>
            <h3 style={{ 
                margin: '0 0 5px 0',  // Reducir margen
                color: KAWAI_COLORS.textDark, 
                textAlign: 'center',
                fontSize: '1.2rem',
            }}>
                {dialogue.questionHeader}
            </h3>
            <EsText show={showSpanish}>{support?.es.questionHeader}</EsText>

            <div className="tt-audio-controls">
                <button
                    type="button"
                    className="tt-audio-btn"
                    onClick={() => play(1)}
                    disabled={isAnswered}
                    aria-label="Play the audio"
                >
                    <Icon name="sonido" size="1.3em" /> {isPlaying ? 'Play again' : 'Play'}
                </button>
                <button
                    type="button"
                    className="tt-audio-btn tt-audio-btn--slow"
                    onClick={() => play(0.75)}
                    disabled={isAnswered}
                    aria-label="Play the audio slowly"
                >
                    <Icon name="tortuga" size="1.3em" /> Slow
                </button>
                <label htmlFor="tt-voice-volume-game">
                    <Icon name="audifonos" size="1.3em" /> Volume
                    <input
                        id="tt-voice-volume-game"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={voiceVolume}
                        onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                    />
                    {Math.round(voiceVolume * 100)}%
                </label>
            </div>
            <EsText show={showSpanish}>Puedes repetir el audio, escucharlo lento (Slow) y subir el volumen de la voz.</EsText>

            <p style={{ 
                marginTop: '3px',  // Reducido de 5px
                fontSize: '0.95rem',
                color: KAWAI_COLORS.textDark,
                margin: 0,
            }}>
                Attempt {attempts + 1} of 2{showSpanish ? ` · Intento ${attempts + 1} de 2` : ''}
            </p>
            <HintBox hints={support?.hints ?? []} used={hintsUsed} showSpanish={showSpanish} />
        </>
    );

    if (showIntro && !allQuestionsCompleted) {
        return <LoadingScreen onAnimationEnd={() => setShowIntro(false)} />;
    }

    if (showCompletionMessage || allQuestionsCompleted) {
        console.log('Pantalla de completado - Progreso:', progress);

        return (
            <CompletionMessage
                totalCompleted={progress.totalCompleted}
                totalQuestions={MINIGAME_3_QUESTIONS.length}
                allQuestionsCompleted={allQuestionsCompleted}
                showCompletionMessage={showCompletionMessage}
                onBackToMap={handleBackToMap}
            />
        );
    }

    if (!currentQuestion) {
        return <LoadingScreen onAnimationEnd={() => undefined} />;
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                preload="auto"
            />

            <div style={{
                ...baseStyle,
                pointerEvents: showExitConfirmation ? 'none' : 'auto',
            }}>

                <button
                    onClick={handleExitClick}
                    disabled={showExitConfirmation}
                    style={logoutButtonStyle}
                >
                    Return to Map
                </button>

                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 15px',
                    backgroundColor: KAWAI_COLORS.panelLight,
                    border: `3px solid ${KAWAI_COLORS.panelBorder}`,
                    borderRadius: '15px',
                    fontFamily: KAWAI_FONTS.mali,
                    fontSize: '1.05rem',
                    zIndex: 20,
                }}>
                    Question {currentQuestionIndex + 1} of {MINIGAME_3_QUESTIONS.length}
                </div>

                <AssistToolbar
                    showSpanish={showSpanish}
                    onToggleSpanish={toggleSpanish}
                    onHowTo={openHowTo}
                    hintsUsed={hintsUsed}
                    hintsTotal={support?.hints.length ?? 0}
                    onHint={takeHint}
                    canHint={isQuestionPhase && !showExitConfirmation}
                />

                {!showStory && (
                    <div style={optionsContainerStyle}>
                        {options.map((option: Option) => (
                            <OptionButton
                                key={option.id}
                                option={option}
                                isSelected={selectedOptionId === option.id}
                                isHovered={hoveredOptionId === option.id}
                                isAnswered={isAnswered}
                                isCorrectAnswer={isCorrectAnswer}
                                showExitConfirmation={showExitConfirmation}
                                onAnswer={(_isCorrect: boolean, id: number) => setPendingId(id)}
                                isPending={pendingId === option.id}
                                isEliminated={eliminatedId === option.id}
                                onHover={setHoveredOptionId}
                            />
                        ))}
                    </div>
                )}

                <div style={dialogBoxStyle}>
                    <div>
                        {showStory ? introText : (isAnswered ?
                            <div>
                                <p style={{ ...(isCorrectAnswer ? KAWAI_STYLES.feedbackCorrect : KAWAI_STYLES.feedbackIncorrect), fontSize: '1.1rem' }}>
                                    {feedback}
                                </p>
                                <EsText show={showSpanish}>{feedbackEs}</EsText>
                            </div>
                            : questionText)}
                    </div>

                    {isQuestionPhase ? (
                        <CheckAnswerButton
                            disabled={!pendingOption || showExitConfirmation}
                            onCheck={() => pendingOption && handleAnswer(pendingOption.isCorrect, pendingOption.id)}
                            style={nextButtonStyle}
                            showSpanish={showSpanish}
                        />
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={(!showStory && !isAnswered && attempts < 2) || showExitConfirmation}
                            style={{
                                ...nextButtonStyle,
                                backgroundColor: ((!showStory && !isAnswered && attempts < 2) || showExitConfirmation)
                                    ? KAWAI_COLORS.bgMedium
                                    : KAWAI_COLORS.accentGreen,
                                cursor: ((!showStory && !isAnswered && attempts < 2) || showExitConfirmation)
                                    ? 'default'
                                    : 'pointer',
                            }}
                        >
                            {buttonText.replace(/\*\*/g, '')}
                        </button>
                    )}
                </div>
            </div>

            {showHowTo && (
                <HowToPlayModal {...HOW_TO_PLAY} onClose={closeHowTo} />
            )}

            {showExitConfirmation && (
                <ExitConfirmationPopup
                    onConfirm={handleConfirmExit}
                    onCancel={handleCancelExit}
                />
            )}
        </>
    );
};

export default ThirdMinigame;